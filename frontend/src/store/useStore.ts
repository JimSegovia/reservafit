import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'admin';
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  status: 'Activo' | 'Inactivo';
}

export interface ClassItem {
  id: string;
  title: string;
  instructorName: string;
  schedule: string;
  status: 'Activo' | 'Inactivo';
  capacity: number;
  enrolled: number;
  theme?: string;
  price: number;
  days?: string[];
  slots?: string[];
  image?: string;
}

export interface Reservation {
  id: string;
  classId: string;
  className: string;
  time: string;
  date: string;
  clientName: string;
  clientPhone: string;
  seats: number[];
  price: number;
  status: 'Pagado' | 'Reembolsado';
}

export interface CurrentBooking {
  classId: string;
  className: string;
  day: string;
  time: string;
  instructorName: string;
  selectedSeats: number[];
  pricePerSeat: number;
  totalPrice: number;
  timeLeft: number; // in seconds
}

interface AppState {
  // Hydration state tracking
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Auth state
  user: User | null;
  otpCode: string | null;
  tempRegisterData: Partial<User> | null;
  
  // Data lists
  instructors: Instructor[];
  classes: ClassItem[];
  reservations: Reservation[];
  
  // Active Seat lock state (by classId_scheduleId)
  occupiedSeats: Record<string, number[]>; // e.g. { "Zumba_12_05_18:00": [9, 17, 18, 19, 21, 28, 30] }

  // Checkout process
  currentBooking: CurrentBooking | null;

  // Actions
  login: (email: string, role: 'client' | 'admin') => boolean;
  registerUser: (data: Partial<User>) => void;
  verifyOtp: (code: string) => boolean;
  logout: () => void;
  
  // Instructor actions (CRUD)
  addInstructor: (instructor: Omit<Instructor, 'id'>) => void;
  updateInstructor: (id: string, instructor: Partial<Instructor>) => void;
  deleteInstructor: (id: string) => void;
  
  // Class actions (CRUD)
  addClass: (classItem: Omit<ClassItem, 'id'>) => void;
  updateClass: (id: string, classItem: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;
  
  // Booking actions
  startBooking: (booking: Omit<CurrentBooking, 'timeLeft' | 'totalPrice' | 'selectedSeats'>) => void;
  selectSeat: (seatNumber: number) => void;
  deselectSeat: (seatNumber: number) => void;
  decrementTimer: () => void;
  clearBooking: () => void;
  confirmBooking: (phoneYape: string) => Reservation | null;
  addManualBooking: (bookingData: {
    clientName: string;
    clientLastName: string;
    clientEmail: string;
    clientPhone: string;
    classId: string;
    schedule: string;
    paymentType: 'Efectivo' | 'Tarjeta';
    price: number;
  }) => boolean;
}

// Initial Data representing mockup values
const initialInstructors: Instructor[] = [
  { id: '1', name: 'Juan Pérez', specialty: 'Salsa', status: 'Activo' },
  { id: '2', name: 'Maria López', specialty: 'Bachata', status: 'Activo' },
  { id: '3', name: 'Carlos Gómez', specialty: 'Salsa', status: 'Activo' },
  { id: '4', name: 'Sofia Ramirez', specialty: 'Salsa', status: 'Inactivo' },
  { id: '5', name: 'Luis Fernández', specialty: 'Salsa', status: 'Activo' },
  { id: '6', name: 'Diego Torres', specialty: 'Urbano', status: 'Inactivo' },
  { id: '7', name: 'Raul', specialty: 'Baile funcional', status: 'Activo' },
];

const initialClasses: ClassItem[] = [
  { id: 'c1', title: 'Salsa Básica', instructorName: 'Juan Pérez', schedule: 'Lun / Mié 6-7 PM', status: 'Activo', capacity: 30, enrolled: 15, price: 40, days: ['LUNES 10/05', 'MIÉRCOLES 12/05', 'VIERNES 14/05'], slots: ['6:00 PM - 7:00 PM'], theme: 'Luces Clásicas' },
  { id: 'c2', title: 'Bachata Intermedio', instructorName: 'Maria López', schedule: 'Mar / Jue 7-8 PM', status: 'Activo', capacity: 30, enrolled: 20, price: 40, days: ['MARTES 11/05', 'JUEVES 13/05'], slots: ['7:00 PM - 8:00 PM'] },
  { id: 'c3', title: 'Regguetón Fit', instructorName: 'Carlos Gómez', schedule: 'Vie 8-9 PM', status: 'Activo', capacity: 30, enrolled: 6, price: 40, days: ['VIERNES 14/05'], slots: ['8:00 PM - 9:00 PM'] },
  { id: 'c4', title: 'Salsa Avanzada', instructorName: 'Sofia Ramirez', schedule: 'Lun / Mié 8-9 PM', status: 'Inactivo', capacity: 30, enrolled: 0, price: 45 },
  { id: 'c5', title: 'Bachata Sensual', instructorName: 'Luis Fernández', schedule: 'Mar / Jue 8-9 PM', status: 'Activo', capacity: 30, enrolled: 12, price: 40 },
  { id: 'c6', title: 'Urbano Dance', instructorName: 'Diego Torres', schedule: 'Sab 5-6 PM', status: 'Activo', capacity: 30, enrolled: 10, price: 35 },
  { id: 'c7', title: 'Zumba', instructorName: 'Profesor A', schedule: 'Lunes - Miercoles - Viernes', status: 'Activo', capacity: 30, enrolled: 7, price: 40, days: ['LUNES 10/05', 'MIÉRCOLES 12/05', 'VIERNES 14/05'], slots: ['5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM', '9:00 PM - 10:00 PM'], theme: 'Tropical neon' },
  { id: 'c8', title: 'Salsa', instructorName: 'Profesor B', schedule: 'Martes - Jueves - Sábado', status: 'Activo', capacity: 30, enrolled: 18, price: 40, days: ['MARTES 11/05', 'JUEVES 13/05', 'SÁBADO 15/05'], slots: ['4:00 PM - 5:00 PM'] },
  { id: 'c9', title: 'Reageton', instructorName: 'Profesor C', schedule: 'Lunes - Jueves - Viernes', status: 'Activo', capacity: 30, enrolled: 22, price: 40, days: ['LUNES 10/05', 'JUEVES 13/05', 'VIERNES 14/05'], slots: ['9:00 PM - 10:00 PM'] },
  { id: 'c10', title: 'Baile funcional', instructorName: 'Raul', schedule: 'Lunes 09/05 6:00 PM', status: 'Activo', capacity: 30, enrolled: 15, price: 40, days: ['LUNES 09/05'], slots: ['6:00 PM - 7:00 PM'], theme: 'Neon Fucsia' }
];

const initialReservations: Reservation[] = [
  { id: 'r1', classId: 'c1', className: 'Salsa Básica', time: '6:00 PM - 7:00 PM', date: '12 May 2025', clientName: 'Andrea Garcia', clientPhone: '987654321', seats: [12], price: 40, status: 'Pagado' },
  { id: 'r2', classId: 'c2', className: 'Bachata Intermedio', time: '7:00 PM - 8:00 PM', date: '12 May 2025', clientName: 'Maria Lopez', clientPhone: '923456789', seats: [14], price: 40, status: 'Pagado' },
  { id: 'r3', classId: 'c3', className: 'Reggaetón Fit', time: '8:00 PM - 9:00 PM', date: '11 May 2025', clientName: 'Carlos Gómez', clientPhone: '956789123', seats: [4], price: 40, status: 'Pagado' },
  { id: 'r4', classId: 'c1', className: 'Salsa Básica', time: '6:00 PM - 7:00 PM', date: '11 May 2025', clientName: 'Juan Pérez', clientPhone: '981234567', seats: [2], price: 40, status: 'Pagado' },
  { id: 'r5', classId: 'c2', className: 'Bachata Intermedio', time: '7:00 PM - 8:00 PM', date: '10 May 2025', clientName: 'Luis Fernández', clientPhone: '911223344', seats: [22], price: 40, status: 'Reembolsado' },
];

const initialOccupiedSeats: Record<string, number[]> = {
  "c7_MIÉRCOLES 12/05_6:00 PM - 7:00 PM": [9, 17, 18, 19, 21, 28, 30],
  "c1_MIÉRCOLES 12/05_6:00 PM - 7:00 PM": [13],
  "c10_LUNES 09/05_6:00 PM - 7:00 PM": [15, 23, 27]
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      user: null,
      otpCode: null,
      tempRegisterData: null,
      
      instructors: initialInstructors,
      classes: initialClasses,
      reservations: initialReservations,
      occupiedSeats: initialOccupiedSeats,
      
      currentBooking: null,

      login: (email, role) => {
        const name = role === 'admin' ? 'Admin' : 'Ana Pérez';
        const userObj: User = {
          id: role === 'admin' ? 'admin_1' : 'client_1',
          name,
          email,
          phone: '999888777',
          role
        };
        
        set({ user: userObj });
        return true;
      },

      registerUser: (data) => {
        set({ tempRegisterData: data, otpCode: '247196' });
      },

      verifyOtp: (code) => {
        const { tempRegisterData } = get();
        if (code === '247196' && tempRegisterData) {
          const newUser: User = {
            id: 'client_' + Date.now(),
            name: `${tempRegisterData.name || 'Invitado'} ${tempRegisterData.phone || ''}`.trim(),
            email: tempRegisterData.email || 'correo@ejemplo.com',
            phone: tempRegisterData.phone || '999888777',
            role: 'client'
          };
          set({ user: newUser, tempRegisterData: null, otpCode: null });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null });
        get().clearBooking();
      },

      // Instructor CRUD
      addInstructor: (instructor) => {
        const newInstructor: Instructor = {
          ...instructor,
          id: 'inst_' + Date.now()
        };
        set((state) => ({ instructors: [newInstructor, ...state.instructors] }));
      },

      updateInstructor: (id, updatedFields) => {
        set((state) => ({
          instructors: state.instructors.map((inst) =>
            inst.id === id ? { ...inst, ...updatedFields } : inst
          )
        }));
      },

      deleteInstructor: (id) => {
        set((state) => ({
          instructors: state.instructors.filter((inst) => inst.id !== id)
        }));
      },

      // Class CRUD
      addClass: (classItem) => {
        const newClass: ClassItem = {
          ...classItem,
          id: 'class_' + Date.now()
        };
        set((state) => ({ classes: [newClass, ...state.classes] }));
      },

      updateClass: (id, updatedFields) => {
        set((state) => ({
          classes: state.classes.map((cls) =>
            cls.id === id ? { ...cls, ...updatedFields } : cls
          )
        }));
      },

      deleteClass: (id) => {
        set((state) => ({
          classes: state.classes.filter((cls) => cls.id !== id)
        }));
      },

      // Client booking actions
      startBooking: (booking) => {
        get().clearBooking();

        const newBooking: CurrentBooking = {
          ...booking,
          selectedSeats: [],
          timeLeft: 600, // 10 minutes
          totalPrice: 0
        };
        set({ currentBooking: newBooking });
      },

      selectSeat: (seatNumber) => {
        const { currentBooking } = get();
        if (!currentBooking) return;
        
        const lockKey = `${currentBooking.classId}_${currentBooking.day}_${currentBooking.time}`;
        const occupied = get().occupiedSeats[lockKey] || [];
        if (occupied.includes(seatNumber)) return;

        const selected = [...currentBooking.selectedSeats, seatNumber];
        set({
          currentBooking: {
            ...currentBooking,
            selectedSeats: selected,
            totalPrice: selected.length * currentBooking.pricePerSeat
          }
        });
      },

      deselectSeat: (seatNumber) => {
        const { currentBooking } = get();
        if (!currentBooking) return;

        const selected = currentBooking.selectedSeats.filter(s => s !== seatNumber);
        set({
          currentBooking: {
            ...currentBooking,
            selectedSeats: selected,
            totalPrice: selected.length * currentBooking.pricePerSeat
          }
        });
      },

      decrementTimer: () => {
        const { currentBooking } = get();
        if (!currentBooking) return;

        if (currentBooking.timeLeft <= 1) {
          get().clearBooking();
        } else {
          set({
            currentBooking: {
              ...currentBooking,
              timeLeft: currentBooking.timeLeft - 1
            }
          });
        }
      },

      clearBooking: () => {
        set({ currentBooking: null });
      },

      confirmBooking: (phoneYape) => {
        const { currentBooking, user } = get();
        if (!currentBooking || currentBooking.selectedSeats.length === 0 || !user) return null;

        const lockKey = `${currentBooking.classId}_${currentBooking.day}_${currentBooking.time}`;
        
        const occupied = get().occupiedSeats[lockKey] || [];
        const newOccupied = [...occupied, ...currentBooking.selectedSeats];
        
        const newReservation: Reservation = {
          id: 'res_' + Date.now(),
          classId: currentBooking.classId,
          className: currentBooking.className,
          time: currentBooking.time,
          date: currentBooking.day.split(' ')[1] + ' May 2025',
          clientName: user.name,
          clientPhone: phoneYape,
          seats: currentBooking.selectedSeats,
          price: currentBooking.totalPrice,
          status: 'Pagado'
        };

        set((state) => ({
          occupiedSeats: {
            ...state.occupiedSeats,
            [lockKey]: newOccupied
          },
          reservations: [newReservation, ...state.reservations],
          currentBooking: null
        }));

        return newReservation;
      },

      addManualBooking: (bookingData) => {
        const classItem = get().classes.find(c => c.id === bookingData.classId);
        if (!classItem) return false;

        const lockKey = `${bookingData.classId}_MIÉRCOLES 12/05_${bookingData.schedule}`;
        const occupied = get().occupiedSeats[lockKey] || [];
        
        let chosenSeat = 1;
        for (let i = 1; i <= 30; i++) {
          if (!occupied.includes(i)) {
            chosenSeat = i;
            break;
          }
        }

        const newReservation: Reservation = {
          id: 'res_' + Date.now(),
          classId: bookingData.classId,
          className: classItem.title,
          time: bookingData.schedule,
          date: '12 May 2025',
          clientName: `${bookingData.clientName} ${bookingData.clientLastName}`,
          clientPhone: bookingData.clientPhone,
          seats: [chosenSeat],
          price: bookingData.price,
          status: 'Pagado'
        };

        const newOccupied = [...occupied, chosenSeat];

        set((state) => ({
          occupiedSeats: {
            ...state.occupiedSeats,
            [lockKey]: newOccupied
          },
          reservations: [newReservation, ...state.reservations]
        }));

        return true;
      }
    }),
    {
      name: "reservafit-storage",
      onRehydrateStorage: (state) => {
        return (hydratedState) => {
          if (hydratedState) {
            hydratedState.setHasHydrated(true);
          }
        };
      },
      partialize: (state) => {
        const { _hasHydrated, setHasHydrated, ...rest } = state;
        return rest;
      }
    }
  )
);
