import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { classesService } from '../services/classes.service';
import { instructorsService } from '../services/instructors.service';
import { reservationsService } from '../services/reservations.service';
import api from '../api/api';
import { Platform } from 'react-native';

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
  id_clase?: string;
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

interface CurrentBooking {
  classId: string;
  id_detalle_clase?: string;
  className: string;
  day: string;
  time: string;
  instructorName: string;
  selectedSeats: number[];
  pricePerSeat: number;
  totalPrice: number;
  timeLeft: number; // in seconds
}

export interface ToastInfo {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppState {
  // Auth state
  user: User | null;
  otpCode: string | null;
  tempRegisterData: Partial<User> | null;
  
  // Toast state
  toast: ToastInfo | null;
  
  // Data lists
  instructors: Instructor[];
  classes: ClassItem[];
  reservations: Reservation[];
  agenda: any[];
  
  // Active Seat lock state (by classId_scheduleId)
  occupiedSeats: Record<string, number[]>;

  // Checkout process
  currentBooking: CurrentBooking | null;
  timerIntervalId: any | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  registerUser: (data: any) => Promise<boolean>;
  fetchClasses: () => Promise<void>;
  fetchInstructors: () => Promise<void>;
  verifyOtp: (code: string) => Promise<boolean>;
  logout: () => void;
  
  // Instructor actions (CRUD)
  addInstructor: (instructor: Omit<Instructor, 'id'>) => Promise<void>;
  updateInstructor: (id: string, instructor: Partial<Instructor>) => Promise<void>;
  deleteInstructor: (id: string) => Promise<void>;
  
  // Class actions (CRUD)
  addClass: (classItem: Omit<ClassItem, 'id'>) => Promise<void>;
  updateClass: (id: string, classItem: Partial<ClassItem>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  
  // Booking actions
  startBooking: (booking: Omit<CurrentBooking, 'timeLeft' | 'totalPrice' | 'selectedSeats'>) => void;
  selectSeat: (seatNumber: number) => void;
  deselectSeat: (seatNumber: number) => void;
  decrementTimer: () => void;
  clearBooking: () => void;
  confirmBooking: (phoneYape: string) => Promise<any | null>;
  addManualBooking: (bookingData: {
    clientName: string;
    clientLastName: string;
    clientEmail: string;
    clientPhone: string;
    classId: string;
    schedule: string;
    paymentType: 'Efectivo' | 'Tarjeta';
    price: number;
  }) => Promise<boolean>;

  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  hideToast: () => void;
  cancelReservation: (id: string) => Promise<void>;
}

// Helpers to format date/time slots
const formatTimeSlot = (startStr: string, endStr: string) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const formatTime = (d: Date) => {
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };
  return `${formatTime(start)} - ${formatTime(end)}`;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Create Zustand store
export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  otpCode: null,
  tempRegisterData: null,
  
  instructors: [],
  classes: [],
  reservations: [],
  agenda: [],
  occupiedSeats: {},
  
  currentBooking: null,
  timerIntervalId: null,
  toast: null,

  login: async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, cuenta } = response.data;
      
      const role = cuenta.rol === 'Administrador' ? 'admin' : 'client';
      
      if (Platform.OS === 'web') {
        localStorage.setItem('token_jwt', token);
      } else {
        const SecureStore = require('expo-secure-store');
        await SecureStore.setItemAsync('token_jwt', token);
      }
      
      // Fetch user profile details
      const profileResponse = await api.get(`/usuarios/${cuenta.id_usuario}`);
      const usuario = profileResponse.data.data;
      
      const userObj: User = {
        id: usuario.id_usuario,
        name: `${usuario.nombres} ${usuario.apellidos}`,
        email: cuenta.correo_electronico,
        phone: usuario.celular || '',
        role: role
      };
      
      set({ user: userObj });

      // Map user's reservations or all reservations
      let mappedReservations: Reservation[] = [];
      if (role === 'admin') {
        try {
          const resData = await reservationsService.getAll();
          mappedReservations = (resData.data || []).map((r: any) => ({
            id: r.id_reserva,
            classId: r.detalle_clase?.id_clase || '',
            className: r.detalle_clase?.clase?.nombre || 'Clase',
            time: r.detalle_clase ? formatTimeSlot(r.detalle_clase.fecha_hora_inicio, r.detalle_clase.fecha_hora_fin) : 'Horario',
            date: r.detalle_clase ? formatDate(r.detalle_clase.fecha_hora_inicio) : 'Fecha',
            clientName: r.usuario ? `${r.usuario.nombres} ${r.usuario.apellidos}` : 'Cliente',
            clientPhone: r.usuario?.celular || '',
            seats: r.detalles_reserva?.map((d: any) => d.numero_cupo) || [],
            price: r.cantidad_cupos * 40,
            status: r.estado === 'Confirmada' ? 'Pagado' : 'Reembolsado'
          }));
        } catch (err) {
          console.error('Fetch all reservations error:', err);
        }
      } else {
        mappedReservations = (usuario.reservas || []).map((r: any) => ({
          id: r.id_reserva,
          classId: r.detalle_clase?.id_clase || '',
          className: r.detalle_clase?.clase?.nombre || 'Clase',
          time: r.detalle_clase ? formatTimeSlot(r.detalle_clase.fecha_hora_inicio, r.detalle_clase.fecha_hora_fin) : 'Horario',
          date: r.detalle_clase ? formatDate(r.detalle_clase.fecha_hora_inicio) : 'Fecha',
          clientName: userObj.name,
          clientPhone: userObj.phone,
          seats: r.detalles_reserva?.map((d: any) => d.numero_cupo) || [],
          price: r.cantidad_cupos * 40,
          status: r.estado === 'Confirmada' ? 'Pagado' : 'Reembolsado'
        }));
      }

      set({ reservations: mappedReservations });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  registerUser: async (data) => {
    try {
      await authService.register({
        nombres: data.name?.split(' ')[0] || 'Usuario',
        apellidos: data.name?.split(' ').slice(1).join(' ') || 'ReservaFit',
        correo_electronico: data.email,
        contrasena: data.password,
        celular: data.phone || ''
      });
      set({ tempRegisterData: { email: data.email, name: data.name, phone: data.phone, role: 'client', id: data.password } });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  },

  fetchClasses: async () => {
    try {
      const backendClassesResponse = await classesService.getAll();
      const backendClasses = backendClassesResponse.data || [];
      
      let agenda: any[] = [];
      try {
        const agendaResponse = await api.get('/agenda');
        agenda = agendaResponse.data.data || [];
      } catch (err) {
        console.error('Fetch agenda error:', err);
      }

      const mappedClasses: ClassItem[] = backendClasses.map((c: any) => {
        const classSchedules = agenda.filter((a: any) => a.id_clase === c.id_clase);
        
        let instructorName = 'Sin asignar';
        let status: 'Activo' | 'Inactivo' = 'Activo';
        let price = 40;
        let descText = c.descripcion || '';

        try {
          if (descText.startsWith('{')) {
            const parsed = JSON.parse(descText);
            instructorName = parsed.instructorName || instructorName;
            price = parsed.price || price;
            status = parsed.status || status;
            descText = parsed.description || descText;
          }
        } catch (e) {}

        const days = classSchedules.map((a: any) => {
          const d = new Date(a.fecha_hora_inicio);
          const labels = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
          const dayNum = d.getDate().toString().padStart(2, '0');
          const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');
          return `${labels[d.getDay()]} ${dayNum}/${monthNum}`;
        });
        
        const slots = classSchedules.map((a: any) => formatTimeSlot(a.fecha_hora_inicio, a.fecha_hora_fin));

        return {
          id: c.id_clase,
          title: c.nombre,
          instructorName: classSchedules[0]?.instructor ? `${classSchedules[0].instructor.nombre} ${classSchedules[0].instructor.apellidos}` : instructorName,
          schedule: c.dia || 'Lunes - Miércoles - Viernes',
          status,
          capacity: classSchedules[0]?.cupos || 30,
          enrolled: 0,
          price,
          theme: c.tematica || undefined,
          days: days.length > 0 ? Array.from(new Set(days)) : ['LUNES 10/05'],
          slots: slots.length > 0 ? Array.from(new Set(slots)) : ['6:00 PM - 7:00 PM'],
          image: c.imagen_url || undefined
        };
      });
      
      set({ classes: mappedClasses, agenda });
    } catch (error) {
      console.error('Fetch classes error:', error);
      set({ classes: [], agenda: [] });
    }
  },

  fetchInstructors: async () => {
    try {
      const response = await instructorsService.getAll();
      const backendInstructors = response.data || [];
      const mappedInstructors: Instructor[] = backendInstructors.map((i: any) => {
        let specialty = 'General';
        let status: 'Activo' | 'Inactivo' = 'Activo';
        
        try {
          if (i.foto_url && i.foto_url.startsWith('{')) {
            const parsed = JSON.parse(i.foto_url);
            specialty = parsed.specialty || specialty;
            status = parsed.status || status;
          }
        } catch (e) {}

        return {
          id: i.id_instructor,
          name: `${i.nombre} ${i.apellidos}`,
          specialty,
          status
        };
      });
      set({ instructors: mappedInstructors });
    } catch (error) {
      console.error('Fetch instructors error:', error);
      set({ instructors: [] });
    }
  },

  verifyOtp: async (code) => {
    try {
      const { tempRegisterData } = get();
      if (!tempRegisterData || !tempRegisterData.email) return false;
      
      await api.post('/auth/verify-otp', {
        correo_electronico: tempRegisterData.email,
        codigo_otp: code
      });
      
      // Auto login
      if (tempRegisterData.email && tempRegisterData.id) {
        const success = await get().login(tempRegisterData.email, tempRegisterData.id);
        if (success) {
          set({ tempRegisterData: null, otpCode: null });
          return true;
        }
      }
      return true;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return false;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, reservations: [] });
    get().clearBooking();
  },

  // Instructor CRUD
  addInstructor: async (instructor) => {
    try {
      const names = instructor.name.split(' ');
      const firstName = names[0] || 'Instructor';
      const lastName = names.slice(1).join(' ') || 'General';
      const serializedFields = JSON.stringify({
        specialty: instructor.specialty,
        status: instructor.status
      });

      await instructorsService.create({
        nombre: firstName,
        apellidos: lastName,
        foto_url: serializedFields
      });

      await get().fetchInstructors();
    } catch (error) {
      console.error('Add instructor error:', error);
    }
  },

  updateInstructor: async (id, updatedFields) => {
    try {
      const existing = get().instructors.find(i => i.id === id);
      if (!existing) return;

      const merged = { ...existing, ...updatedFields };
      const names = merged.name.split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');
      const serializedFields = JSON.stringify({
        specialty: merged.specialty,
        status: merged.status
      });

      await instructorsService.update(id, {
        nombre: firstName,
        apellidos: lastName,
        foto_url: serializedFields
      });

      await get().fetchInstructors();
    } catch (error) {
      console.error('Update instructor error:', error);
    }
  },

  deleteInstructor: async (id) => {
    try {
      await instructorsService.delete(id);
      await get().fetchInstructors();
    } catch (error) {
      console.error('Delete instructor error:', error);
    }
  },

  // Class CRUD
  addClass: async (classItem) => {
    try {
      const descObj = JSON.stringify({
        description: 'Clase de baile',
        instructorName: classItem.instructorName,
        price: classItem.price,
        status: classItem.status
      });

      await classesService.create({
        nombre: classItem.title,
        descripcion: descObj,
        dia: classItem.schedule,
        tematica: classItem.theme || 'General',
        imagen_url: classItem.image || ''
      });

      await get().fetchClasses();
    } catch (error) {
      console.error('Add class error:', error);
    }
  },

  updateClass: async (id, updatedFields) => {
    try {
      if (!id || id === 'undefined') {
        console.error('updateClass: ID inválido', id);
        return;
      }
      const existing = get().classes.find(c => c.id === id);
      if (!existing) return;

      const merged = { ...existing, ...updatedFields };
      const descObj = JSON.stringify({
        description: 'Clase de baile',
        instructorName: merged.instructorName,
        price: merged.price,
        status: merged.status
      });

      await classesService.update(id, {
        nombre: merged.title,
        descripcion: descObj,
        dia: merged.schedule,
        tematica: merged.theme || 'General',
        imagen_url: merged.image || ''
      });

      await get().fetchClasses();
    } catch (error) {
      console.error('Update class error:', error);
    }
  },

  deleteClass: async (id) => {
    try {
      await classesService.delete(id);
      await get().fetchClasses();
    } catch (error) {
      console.error('Delete class error:', error);
    }
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

  confirmBooking: async (phoneYape) => {
    const { currentBooking, user } = get();
    if (!currentBooking || currentBooking.selectedSeats.length === 0 || !user) return null;

    let id_detalle_clase = currentBooking.id_detalle_clase;

    if (!id_detalle_clase) {
      try {
        const agendaResponse = await api.get('/agenda');
        const agenda = agendaResponse.data.data || [];
        const match = agenda.find((a: any) => a.id_clase === currentBooking.classId);
        if (match) {
          id_detalle_clase = match.id_detalle_clase;
        } else {
          const instructorResponse = await api.get('/instructores');
          const instructors = instructorResponse.data.data || [];
          const instructorId = instructors[0]?.id_instructor;
          if (instructorId) {
            const newDetail = await api.post('/agenda', {
              id_clase: currentBooking.classId,
              id_instructor: instructorId,
              fecha_hora_inicio: new Date().toISOString(),
              fecha_hora_fin: new Date(Date.now() + 60*60*1000).toISOString()
            });
            id_detalle_clase = newDetail.data.data.id_detalle_clase;
          }
        }
      } catch (err) {
        console.error('Error finding/creating agenda detail:', err);
      }
    }

    if (!id_detalle_clase) {
      get().showToast('Error: No se pudo agendar la sesión para esta clase.', 'error');
      return null;
    }

    let lastReservation: any = null;
    try {
      for (const seat of currentBooking.selectedSeats) {
        const response = await api.post('/reservas/reservas', {
          id_usuario: user.id,
          id_detalle_clase,
          numero_cupo: seat
        });
        
        const reservationId = response.data.reserva.id_reserva;
        lastReservation = response.data.reserva;
        
        if (Platform.OS !== 'web') {
          await api.patch(`/reservas/${reservationId}`, {
            estado: 'Confirmada'
          });
        }
      }
      
      // Refresh user profile reservations
      const profileResponse = await api.get(`/usuarios/${user.id}`);
      const updatedUser = profileResponse.data.data;
      const mappedReservations = (updatedUser.reservas || []).map((r: any) => ({
        id: r.id_reserva,
        classId: r.detalle_clase?.id_clase || '',
        className: r.detalle_clase?.clase?.nombre || 'Clase',
        time: r.detalle_clase ? formatTimeSlot(r.detalle_clase.fecha_hora_inicio, r.detalle_clase.fecha_hora_fin) : 'Horario',
        date: r.detalle_clase ? formatDate(r.detalle_clase.fecha_hora_inicio) : 'Fecha',
        clientName: user.name,
        clientPhone: phoneYape || user.phone,
        seats: r.detalles_reserva?.map((d: any) => d.numero_cupo) || [],
        price: r.cantidad_cupos * 40,
        status: r.estado === 'Confirmada' ? 'Pagado' : 'Reembolsado'
      }));
      
      set({ reservations: mappedReservations, currentBooking: null });
      return lastReservation;
    } catch (err: any) {
      console.error('Confirm booking error:', err);
      get().showToast(err.response?.data?.error || 'Error al confirmar la reserva', 'error');
      return null;
    }
  },

  addManualBooking: async (bookingData) => {
    try {
      const usersResponse = await api.get('/usuarios');
      const users = usersResponse.data.data || [];
      let targetUser = users.find((u: any) => u.cuenta?.correo_electronico === bookingData.clientEmail || u.cuentas?.[0]?.correo_electronico === bookingData.clientEmail);
      
      if (!targetUser) {
        const registerResponse = await api.post('/auth/register', {
          nombres: bookingData.clientName,
          apellidos: bookingData.clientLastName,
          correo_electronico: bookingData.clientEmail,
          celular: bookingData.clientPhone,
          contrasena: 'ReservaFit123!',
          rol: 'Cliente'
        });
        const newUserId = registerResponse.data.data.usuario.id_usuario;
        targetUser = { id_usuario: newUserId };
      }
      
      const userId = targetUser.id_usuario;

      const agendaResponse = await api.get('/agenda');
      const agenda = agendaResponse.data.data || [];
      let match = agenda.find((a: any) => a.id_clase === bookingData.classId);
      
      if (!match) {
        const instructorsResponse = await api.get('/instructores');
        const instructors = instructorsResponse.data.data || [];
        const instructorId = instructors[0]?.id_instructor;
        if (!instructorId) return false;
        
        const newDetail = await api.post('/agenda', {
          id_clase: bookingData.classId,
          id_instructor: instructorId,
          fecha_hora_inicio: new Date().toISOString(),
          fecha_hora_fin: new Date(Date.now() + 60*60*1000).toISOString()
        });
        match = newDetail.data.data;
      }
      
      const occupiedResponse = await api.get(`/detalles-reserva/ocupados/${match.id_detalle_clase}`);
      const occupied = occupiedResponse.data.data || [];
      let chosenSeat = 1;
      for (let i = 1; i <= 30; i++) {
        if (!occupied.includes(i)) {
          chosenSeat = i;
          break;
        }
      }

      const resResponse = await api.post('/reservas/reservas', {
        id_usuario: userId,
        id_detalle_clase: match.id_detalle_clase,
        numero_cupo: chosenSeat
      });

      const reservationId = resResponse.data.reserva.id_reserva;
      await api.patch(`/reservas/${reservationId}`, {
        estado: 'Confirmada'
      });

      if (get().user?.role === 'admin') {
        const resData = await reservationsService.getAll();
        const mappedReservations = (resData.data || []).map((r: any) => ({
          id: r.id_reserva,
          classId: r.detalle_clase?.id_clase || '',
          className: r.detalle_clase?.clase?.nombre || 'Clase',
          time: r.detalle_clase ? formatTimeSlot(r.detalle_clase.fecha_hora_inicio, r.detalle_clase.fecha_hora_fin) : 'Horario',
          date: r.detalle_clase ? formatDate(r.detalle_clase.fecha_hora_inicio) : 'Fecha',
          clientName: r.usuario ? `${r.usuario.nombres} ${r.usuario.apellidos}` : 'Cliente',
          clientPhone: r.usuario?.celular || '',
          seats: r.detalles_reserva?.map((d: any) => d.numero_cupo) || [],
          price: r.cantidad_cupos * 40,
          status: r.estado === 'Confirmada' ? 'Pagado' : 'Reembolsado'
        }));
        set({ reservations: mappedReservations });
      }

      return true;
    } catch (err) {
      console.error('Add manual booking error:', err);
      return false;
    }
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
  },

  hideToast: () => {
    set({ toast: null });
  },

  cancelReservation: async (id) => {
    try {
      await api.patch(`/reservas/${id}`, {
        estado: 'Cancelada_Por_Gimnasio'
      });
      
      const { user } = get();
      if (user) {
        if (user.role === 'admin') {
          const resData = await reservationsService.getAll();
          const mappedReservations = (resData.data || []).map((r: any) => ({
            id: r.id_reserva,
            classId: r.detalle_clase?.id_clase || '',
            className: r.detalle_clase?.clase?.nombre || 'Clase',
            time: r.detalle_clase ? formatTimeSlot(r.detalle_clase.fecha_hora_inicio, r.detalle_clase.fecha_hora_fin) : 'Horario',
            date: r.detalle_clase ? formatDate(r.detalle_clase.fecha_hora_inicio) : 'Fecha',
            clientName: r.usuario ? `${r.usuario.nombres} ${r.usuario.apellidos}` : 'Cliente',
            clientPhone: r.usuario?.celular || '',
            seats: r.detalles_reserva?.map((d: any) => d.numero_cupo) || [],
            price: r.cantidad_cupos * 40,
            status: r.estado === 'Confirmada' ? 'Pagado' : 'Reembolsado'
          }));
          set({ reservations: mappedReservations });
        } else {
          const profileResponse = await api.get(`/usuarios/${user.id}`);
          const usuario = profileResponse.data.data;
          const mappedReservations = (usuario.reservas || []).map((r: any) => ({
            id: r.id_reserva,
            classId: r.detalle_clase?.id_clase || '',
            className: r.detalle_clase?.clase?.nombre || 'Clase',
            time: r.detalle_clase ? formatTimeSlot(r.detalle_clase.fecha_hora_inicio, r.detalle_clase.fecha_hora_fin) : 'Horario',
            date: r.detalle_clase ? formatDate(r.detalle_clase.fecha_hora_inicio) : 'Fecha',
            clientName: user.name,
            clientPhone: user.phone,
            seats: r.detalles_reserva?.map((d: any) => d.numero_cupo) || [],
            price: r.cantidad_cupos * 40,
            status: r.estado === 'Confirmada' ? 'Pagado' : 'Reembolsado'
          }));
          set({ reservations: mappedReservations });
        }
      }
    } catch (error) {
      console.error('Cancel reservation error:', error);
    }
  }
}));
