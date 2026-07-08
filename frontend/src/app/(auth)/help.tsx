import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';

type HelpTab = 'faq' | 'manual';

interface FAQItem {
  question: string;
  answer: string;
}

interface ManualSection {
  title: string;
  content?: string;
  screenshot?: string;
  image?: ReturnType<typeof require>;
  subsections?: ManualSubsection[];
}

interface ManualSubsection {
  title: string;
  content: string;
  screenshot?: string;
  image?: ReturnType<typeof require>;
  steps?: string[];
}

const manualImg1 = require('../../../assets/images/manual/manual-seccion-1.png');
const manualImg21 = require('../../../assets/images/manual/manual-seccion-2-1.png');
const manualImg22 = require('../../../assets/images/manual/manual-seccion-2-2.png');
const manualImg31 = require('../../../assets/images/manual/manual-seccion-3-1.png');
const manualImg32 = require('../../../assets/images/manual/manual-seccion-3-2.png');
const manualImg4 = require('../../../assets/images/manual/manual-seccion-4.png');
const manualImg41 = require('../../../assets/images/manual/manual-seccion-4-1.png');
const manualImg42 = require('../../../assets/images/manual/manual-seccion-4-2.png');
const manualImg43 = require('../../../assets/images/manual/manual-seccion-4-3.png');
const manualImg44 = require('../../../assets/images/manual/manual-seccion-4-4.png');
const manualImg51 = require('../../../assets/images/manual/manual-seccion-5-1.png');
const manualImg52 = require('../../../assets/images/manual/manual-seccion-5-2.png');
const manualImg53 = require('../../../assets/images/manual/manual-seccion-5-3.png');
const manualImg54 = require('../../../assets/images/manual/manual-seccion-5-4.png');
const manualImg55 = require('../../../assets/images/manual/manual-seccion-5-5.png');
const manualImg61 = require('../../../assets/images/manual/manual-seccion-6-1.png');
const manualImg62 = require('../../../assets/images/manual/manual-seccion-6-2.png');
const manualImg71 = require('../../../assets/images/manual/manual-seccion-7-1.png');
const manualImg72 = require('../../../assets/images/manual/manual-seccion-7-2.png');
const manualImg73 = require('../../../assets/images/manual/manual-seccion-7-3.png');
const manualImg74 = require('../../../assets/images/manual/manual-seccion-7-4.png');
const manualImg81 = require('../../../assets/images/manual/manual-seccion-8-1.png');
const manualImg9 = require('../../../assets/images/manual/manual-seccion-9.png');
const manualImg101 = require('../../../assets/images/manual/manual-seccion-10-1.png');

export default function HelpScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
  const isNative = Platform.OS !== 'web';

  const [activeTab, setActiveTab] = useState<HelpTab>('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: '¿Cómo puedo reservar una clase?',
      answer: 'Es muy sencillo: ve a la sección de "Clases", filtra por el día o la disciplina que prefieras y presiona "Ver horarios y reservar". Luego, selecciona tus asientos libres en el mapa interactivo y completa el pago correspondiente.',
    },
    {
      question: '¿Por cuánto tiempo se bloquean mis asientos?',
      answer: 'Al seleccionar tus asientos, estos quedarán reservados exclusivamente para ti durante 10 minutos. Durante este tiempo, debes completar el proceso de pago. Si el tiempo expira, los asientos volverán a estar disponibles para otros usuarios.',
    },
    {
      question: '¿Cómo cancelo una reserva y obtengo un reembolso?',
      answer: 'Puedes cancelar una reserva activa ingresando a tu panel de inicio ("Mis clases"). Busca la clase que deseas cancelar, presiona el botón "Cancelar" y confirma la acción en el diálogo. Tu reserva será cancelada y se gestionará el reembolso de forma inmediata.',
    },
    {
      question: '¿Qué métodos de pago están permitidos?',
      answer: 'En la plataforma web, aceptamos pagos a través de Yape. En la aplicación móvil nativa, aceptamos tarjetas de crédito, débito y billeteras móviles compatibles a través de la pasarela de pagos segura de Stripe.',
    },
    {
      question: '¿Hay un límite de reservas por usuario?',
      answer: 'No existe un límite estricto de reservas, pero debes asegurarte de contar con créditos suficientes o completar el proceso de pago para cada clase a la que decidas asistir. Los cupos están sujetos a la capacidad física de la sala (30 espacios).',
    },
  ];

  const manualSections: ManualSection[] = [
    {
      title: '1. Introducción a ReservaFit',
      content: 'ReservaFit es una plataforma de reserva de clases de fitness que te permite buscar horarios, seleccionar tu asiento en un mapa interactivo y gestionar tus reservas desde un solo lugar. Las disciplinas disponibles incluyen Salsa, Bachata, Zumba, Reggaetón y clases especiales.',
      screenshot: 'Pantalla principal de bienvenida (landing page) con el logo de ReservaFit, botones de Iniciar Sesión y Registrarse.',
      image: manualImg1,
    },
    {
      title: '2. Registro de Usuario',
      subsections: [
        {
          title: '2.1 Crear una cuenta',
          content: 'Para comenzar a usar ReservaFit, primero debes crear una cuenta. Este proceso consta de dos pasos: registro y verificación.',
          steps: [
            'Desde la pantalla de inicio, presiona el botón "Registrarse".',
            'Completa el formulario con tu nombre, apellidos, correo electrónico, teléfono y contraseña.',
            'Opcionalmente, ingresa un código de referido si cuentas con uno.',
            'Presiona "Crear cuenta" para enviar el formulario.',
          ],
          screenshot: 'Formulario de registro completo con los campos: nombre, apellidos, correo electrónico, teléfono, contraseña, confirmar contraseña y código de referido (opcional).',
          image: manualImg21,
        },
        {
          title: '2.2 Verificación de cuenta (OTP)',
          content: 'Después de registrarte, recibirás un código de verificación de 6 dígitos en tu correo electrónico.',
          steps: [
            'Revisa tu bandeja de entrada (y la carpeta de spam) para encontrar el correo de verificación.',
            'Ingresa el código de 6 dígitos en la pantalla de verificación.',
            'Al validarse correctamente, tu cuenta quedará activada y serás redirigido al panel de inicio.',
            'Si no recibes el código, puedes presionar "Reenviar código" para solicitar uno nuevo.',
          ],
          screenshot: 'Pantalla de verificación OTP mostrando los 6 campos para dígitos y el botón de reenviar código.',
          image: manualImg22,
        },
      ],
    },
    {
      title: '3. Inicio de Sesión',
      subsections: [
        {
          title: '3.1 Acceder a tu cuenta',
          content: 'Una vez que tu cuenta está activada, puedes iniciar sesión en cualquier momento.',
          steps: [
            'Desde la pantalla de inicio, presiona "Iniciar Sesión".',
            'Ingresa tu correo electrónico y contraseña.',
            'Presiona "Ingresar". Serás redirigido a tu panel de control.',
          ],
          screenshot: 'Pantalla de inicio de sesión con campos de correo electrónico y contraseña, botón de Ingresar y enlaces inferiores.',
          image: manualImg31,
        },
        {
          title: '3.2 Recuperar contraseña',
          content: 'Si olvidaste tu contraseña, puedes restablecerla en pocos pasos.',
          steps: [
            'En la pantalla de login, presiona "¿Olvidaste tu contraseña?".',
            'Ingresa tu correo electrónico y presiona "Enviar código".',
            'Recibirás un código OTP de 6 dígitos en tu correo.',
            'Ingresa el código en la pantalla de restablecimiento.',
            'Define una nueva contraseña y confírmala.',
            'Presiona "Restablecer contraseña". Ahora puedes iniciar sesión con tu nueva contraseña.',
          ],
          screenshot: 'Pantalla de restablecimiento de contraseña: campo de nueva contraseña, confirmación y botón de restablecer.',
          image: manualImg32,
        },
      ],
    },
    {
      title: '4. Panel de Inicio (Dashboard)',
      content: 'Al iniciar sesión, llegarás a tu panel de inicio. Esta es tu vista principal donde puedes ver de un vistazo toda tu actividad en ReservaFit.',
      screenshot: 'Vista general del panel de inicio mostrando el saludo personalizado, saldo de MonedasFit, lista de reservas activas y acceso rápido a clases.',
      image: manualImg4,
      subsections: [
        {
          title: '4.1 Mis Clases Reservadas',
          content: 'En la sección principal del panel verás todas tus reservas activas. Cada tarjeta de reserva muestra la imagen de la clase, el nombre, día, horario, instructor y los asientos que seleccionaste. Desde aquí puedes cancelar cualquier reserva presionando el botón "Cancelar".',
          screenshot: 'Lista de clases reservadas con tarjetas mostrando imagen, nombre de clase, fecha, horario, instructor y botón Cancelar.',
          image: manualImg41,
        },
        {
          title: '4.2 Clases de Hoy',
          content: 'Esta sección te muestra únicamente las clases que tienes programadas para el día actual, para que sepas exactamente a qué hora y dónde debes estar.',
          screenshot: 'Vista de clases de hoy mostrando las reservas del día actual con horario y ubicación.',
          image: manualImg42,
        },
        {
          title: '4.3 Calendario Semanal',
          content: 'El calendario semanal te permite visualizar todas tus clases de la semana en un formato de cuadrícula de días (lunes a sábado) vs. horarios. Cada clase reservada aparece como un bloque de color según la disciplina.',
          screenshot: 'Calendario semanal con cuadrícula de días y horarios, mostrando bloques de colores para cada clase reservada.',
          image: manualImg43,
        },
        {
          title: '4.4 MonedasFit',
          content: 'En la parte superior del panel verás tu saldo de MonedasFit. Estas monedas las ganas al cancelar reservas pagadas y puedes usarlas para reservar nuevas clases. Presiona el saldo para ver tu historial completo de transacciones.',
          screenshot: 'Pantalla de MonedasFit mostrando el saldo actual y el historial de transacciones (ganadas y gastadas).',
          image: manualImg44,
        },
      ],
    },
    {
      title: '5. Explorar Clases',
      subsections: [
        {
          title: '5.1 Catálogo de Clases',
          content: 'Desde la pestaña "Clases" en la barra inferior (móvil) o el panel de navegación (web) accedes al catálogo completo de disciplinas disponibles: Salsa, Bachata, Zumba, Reggaetón y clases especiales.',
          screenshot: 'Vista del catálogo de clases mostrando tarjetas con imagen, nombre y descripción de cada disciplina.',
          image: manualImg51,
        },
        {
          title: '5.2 Filtrar Clases',
          content: 'Usa los filtros en la parte superior para encontrar exactamente lo que buscas. Puedes filtrar por día de la semana (Lunes a Sábado) o por tipo de disciplina. Los resultados se actualizan inmediatamente.',
          screenshot: 'Barra de filtros mostrando las opciones de día de la semana y tipo de disciplina (Salsa, Bachata, Zumba, Reggaetón).',
          image: manualImg52,
        },
        {
          title: '5.3 Vista de Calendario',
          content: 'Alterna a la vista "Calendario" para ver la programación semanal completa en una cuadrícula. Usa las flechas (< >) para navegar entre semanas. Cada celda muestra las clases disponibles en ese día y horario.',
          screenshot: 'Vista de calendario semanal con cuadrícula de días vs. horarios, mostrando las clases disponibles por franja horaria.',
          image: manualImg53,
        },
        {
          title: '5.4 Horarios Disponibles',
          content: 'Al seleccionar una clase del catálogo, verás la lista de próximas sesiones con su estado: "Disponible" (puedes reservar), "Lleno" (sin cupos) o "Cancelada" (no se dictará).',
          screenshot: 'Lista de horarios disponibles para una clase, mostrando fecha, hora y estado de cada sesión.',
          image: manualImg54,
        },
        {
          title: '5.5 Detalle de Clase',
          content: 'Al presionar una sesión disponible, verás todos los detalles: nombre de la clase, imagen, instructor, día y horario, capacidad (ej. 12/30 asientos ocupados) y precio. Desde aquí inicias el proceso de reserva presionando "Inscribirse".',
          screenshot: 'Pantalla de detalle de clase con imagen, nombre, instructor, barra de capacidad y botón Inscribirse.',
          image: manualImg55,
        },
      ],
    },
    {
      title: '6. Reservar una Clase',
      subsections: [
        {
          title: '6.1 Selección de Asientos',
          content: 'El mapa interactivo de asientos te permite elegir exactamente dónde quieres ubicarte en la sala. La sala tiene capacidad para 30 personas.',
          steps: [
            'Después de presionar "Inscribirse", se abre el mapa de asientos.',
            'Los asientos disponibles se muestran en color verde.',
            'Los asientos ya ocupados aparecen en gris.',
            'Presiona los asientos que deseas reservar (se marcarán en naranja).',
            'Puedes seleccionar múltiples asientos si reservas para acompañantes.',
            'El precio total se actualiza automáticamente según la cantidad de asientos.',
          ],
          screenshot: 'Mapa interactivo de 30 asientos en cuadrícula 6x5, con asientos disponibles (verde), seleccionados (naranja) y ocupados (gris).',
          image: manualImg61,
        },
        {
          title: '6.2 Temporizador de Reserva',
          content: 'Al seleccionar tus asientos, estos quedan bloqueados exclusivamente para ti durante 10 minutos. Verás un temporizador en pantalla con la cuenta regresiva. Debes completar el pago dentro de este tiempo. Si el temporizador llega a cero, los asientos se liberan automáticamente.',
          screenshot: 'Temporizador de 10 minutos en la pantalla de selección de asientos, mostrando el tiempo restante en formato MM:SS.',
          image: manualImg62,
        },
      ],
    },
    {
      title: '7. Pago',
      subsections: [
        {
          title: '7.1 Métodos de Pago Disponibles',
          content: 'ReservaFit ofrece diferentes métodos de pago según la plataforma que estés utilizando:',
          steps: [
            'Web: Pago mediante Yape o PLIN.',
            'App móvil (iOS): Tarjetas de crédito/débito y Apple Pay a través de Stripe.',
            'App móvil (Android): Tarjetas de crédito/débito y billeteras digitales a través de Mercado Pago.',
          ],
          screenshot: 'Pantalla de checkout mostrando los métodos de pago disponibles (Yape/PLIN en web, Mercado Pago en móvil).',
          image: manualImg71,
        },
        {
          title: '7.2 Completar el Pago',
          content: 'Al presionar "Continuar con el pago" desde la selección de asientos, serás redirigido a la pasarela de pagos. Sigue las instrucciones en pantalla para completar la transacción de forma segura.',
          screenshot: 'Pantalla de pago con el resumen de la reserva (clase, asientos, total) y el botón de confirmación.',
          image: manualImg72,
        },
        {
          title: '7.3 Pago Exitoso',
          content: 'Al completar el pago correctamente, verás una pantalla de confirmación con todos los detalles de tu reserva: nombre de la clase, día, horario, instructor, asientos reservados y comprobante. Presiona "Ir al inicio" para volver al panel.',
          screenshot: 'Pantalla de confirmación de pago exitoso con los detalles de la reserva y botón Ir al inicio.',
          image: manualImg73,
        },
        {
          title: '7.4 Pago Fallido o Pendiente',
          content: 'Si el pago es rechazado, verás una pantalla con el motivo del error y la opción de "Intentar de nuevo" o "Ir al inicio". Si el pago queda en estado pendiente, el sistema verificará automáticamente su estado y te notificará cuando se apruebe.',
          screenshot: 'Pantalla de pago fallido mostrando el mensaje de error y los botones de reintentar y volver al inicio.',
          image: manualImg74,
        },
      ],
    },
    {
      title: '8. Gestionar Reservas',
      subsections: [
        {
          title: '8.1 Cancelar una Reserva',
          content: 'Si necesitas cancelar una reserva, puedes hacerlo fácilmente desde tu panel de inicio.',
          steps: [
            'Ve a la sección "Mis Clases" en el panel de inicio.',
            'Busca la clase que deseas cancelar.',
            'Presiona el botón "Cancelar" en la tarjeta de la reserva.',
            'Confirma la cancelación en el diálogo que aparece.',
            'La reserva se cancela inmediatamente y los asientos vuelven a estar disponibles.',
          ],
          screenshot: 'Diálogo de confirmación de cancelación mostrando los detalles de la clase y el botón de confirmar.',
          image: manualImg81,
        },
        {
          title: '8.2 Política de Cancelación y Reembolsos',
          content: 'Las cancelaciones son inmediatas y sin penalización. Si cancelas una reserva pagada, el monto se te reembolsará en MonedasFit automáticamente. Estas monedas podrás usarlas para futuras reservas. Si tu reserva fue gratuita o pagada con MonedasFit, simplemente se liberan los cupos sin reembolso adicional.',
        },
      ],
    },
    {
      title: '9. Historial de Pagos',
      content: 'Desde la pestaña "Pagos" en la barra inferior (móvil) o el panel de navegación (web) puedes consultar tu historial completo de transacciones. Cada entrada muestra: nombre de la clase, monto, fecha, método de pago utilizado y estado (aprobado, pendiente, fallido). Presiona cualquier entrada para ver el comprobante detallado.',
      screenshot: 'Tabla de historial de pagos con columnas: clase, monto, fecha, método de pago y estado. Modal de comprobante al presionar una entrada.',
      image: manualImg9,
    },
    {
      title: '10. Perfil y Configuración',
      content: 'Para acceder a tu perfil, presiona tu nombre (en web) o el ícono de perfil (en móvil). Desde aquí puedes:',
      subsections: [
        {
          title: '10.1 Editar Información Personal',
          content: 'Puedes modificar tu nombre, apellidos y número de teléfono. El correo electrónico no es editable por seguridad. Presiona "Guardar cambios" para aplicar las modificaciones.',
          screenshot: 'Pantalla de perfil con campos editables de nombre, apellidos y teléfono, y campo de correo electrónico solo lectura.',
          image: manualImg101,
        },
        {
          title: '10.2 Código de Referido',
          content: 'En tu perfil encontrarás tu código de referido único. Compártelo con amigos para que lo ingresen al registrarse.',
        },
        {
          title: '10.3 Cerrar Sesión',
          content: 'Para cerrar sesión, usa la opción "Cerrar Sesión" en el menú lateral (web) o en la parte inferior de la pantalla de perfil (móvil). Serás redirigido a la pantalla de inicio.',
        },
      ],
    },
    {
      title: '11. Centro de Ayuda y Soporte',
      content: 'Si tienes dudas, puedes consultar las Preguntas Frecuentes (FAQ) en la pestaña correspondiente de este centro de ayuda. Para consultas que no encuentres aquí, escríbenos a soporte@reservafit.com y te atenderemos a la brevedad.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream p-0 m-0">
      {/* Web Header */}
      {isWeb && (
        <Animated.View entering={FadeIn.duration(200)} className="flex-row justify-between items-center py-5 px-10 border-b border-gray-300/50 bg-cream z-10">
          <TouchableOpacity onPress={() => router.push('/(auth)/landing')} className="flex-row items-center">
            <ExpoImage
              source={require('../../../assets/images/logo.svg')}
              style={{ width: 160, height: 50 }}
              contentFit="contain"
            />
          </TouchableOpacity>
        </Animated.View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingBottom: 30, 
            paddingHorizontal: isWeb ? 0 : 24, 
            paddingVertical: isWeb ? 40 : 16,
            justifyContent: isWeb ? 'flex-start' : 'flex-start'
          }} 
          showsVerticalScrollIndicator={true}
        >
          <View className={`md:w-[600px] md:mx-auto md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 md:px-12 md:py-10`}>
            
            {/* Mobile Header with Back Button */}
            {!isWeb && (
              <Animated.View entering={FadeIn.duration(200)} className="flex-row items-center justify-between mt-2 mb-6">
                <TouchableOpacity onPress={() => router.back()} className="flex-row items-center py-1">
                  <Ionicons name="arrow-back" size={24} color="black" />
                  <Text className="text-sm font-semibold ml-1">Volver</Text>
                </TouchableOpacity>
                <View className="flex-row items-center">
                  <ExpoImage
                    source={require('../../../assets/images/logo.svg')}
                    style={{ width: 120, height: 35 }}
                    contentFit="contain"
                  />
                </View>
              </Animated.View>
            )}

            {/* Title / Header */}
            <Animated.View entering={FadeInDown.duration(200).delay(50)} className="items-center mb-6">
              <View className="w-14 h-14 rounded-full bg-orange-100 items-center justify-center mb-3">
                <Ionicons name="help-buoy-outline" size={28} color="#FF7A00" />
              </View>
              <Text className="text-2xl font-extrabold text-black text-center">Centro de Ayuda</Text>
            </Animated.View>

            {/* Tab Switcher */}
            <Animated.View entering={FadeInDown.duration(200).delay(80)} className="flex-row bg-gray-100 rounded-xl p-1 mb-6">
              <TouchableOpacity
                onPress={() => setActiveTab('faq')}
                className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'faq' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text className={`text-sm font-bold ${activeTab === 'faq' ? (isNative ? 'text-primary-text-strong' : 'text-primary') : 'text-gray-500'}`}>
                  Preguntas Frecuentes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('manual')}
                className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'manual' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text className={`text-sm font-bold ${activeTab === 'manual' ? (isNative ? 'text-primary-text-strong' : 'text-primary') : 'text-gray-500'}`}>
                  Manual de Usuario
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <>
                <Text className="text-gray-500 text-xs font-bold text-center mt-1 mb-4">Preguntas Frecuentes (FAQ)</Text>

                <View className="gap-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                      <Animated.View 
                        key={index} 
                        entering={FadeInDown.duration(200).delay(80 + index * 40)}
                        layout={Layout.springify()}
                        className={`border rounded-2xl bg-white overflow-hidden ${isOpen ? 'border-primary' : 'border-gray-300'}`}
                      >
                        <TouchableOpacity 
                          onPress={() => toggleFAQ(index)} 
                          activeOpacity={0.7}
                          className="flex-row justify-between items-center p-4"
                        >
                          <Text className={`text-sm font-bold flex-1 pr-4 ${isOpen ? isNative ? 'text-primary-text-strong' : 'text-primary' : 'text-gray-800'}`}>
                            {faq.question}
                          </Text>
                          <Ionicons 
                            name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'} 
                            size={18} 
                            color={isOpen ? '#FF7A00' : 'gray'} 
                          />
                        </TouchableOpacity>

                        {isOpen && (
                          <Animated.View entering={FadeIn.duration(200)} className="px-4 pb-4 pt-1 border-t border-gray-100">
                            <Text className={`text-xs ${isNative ? 'text-gray-600' : 'text-gray-500'} font-semibold leading-relaxed`}>
                              {faq.answer}
                            </Text>
                          </Animated.View>
                        )}
                      </Animated.View>
                    );
                  })}
                </View>

                {/* Support Box */}
                <TouchableOpacity 
                  onPress={() => Linking.openURL('mailto:reservafitgym@gmail.com')}
                  activeOpacity={0.7}
                >
                  <Animated.View 
                    entering={FadeInDown.duration(200).delay(350)} 
                    className="bg-orange-50 border border-orange-150 rounded-2xl p-4 mt-8 items-center"
                  >
                    <Ionicons name="mail-open-outline" size={24} color="#FF7A00" />
                    <Text className="text-xs font-bold text-gray-800 mt-2 text-center">¿No encontraste lo que buscabas?</Text>
                    <Text className="text-[10px] text-gray-500 mt-1 text-center font-semibold">Escríbenos directamente a reservafitgym@gmail.com y responderemos a la brevedad.</Text>
                  </Animated.View>
                </TouchableOpacity>
              </>
            )}

            {/* Manual de Usuario Tab */}
            {activeTab === 'manual' && (
              <>
                <Text className="text-gray-500 text-xs font-bold text-center mt-1 mb-6">Manual de Usuario — Guía Completa</Text>

                {/* Table of Contents */}
                <Animated.View entering={FadeInDown.duration(200).delay(80)} className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
                  <Text className="text-sm font-bold text-gray-800 mb-2">Índice</Text>
                  {manualSections.map((section, idx) => (
                    <Text key={idx} className="text-xs text-gray-600 font-semibold leading-relaxed ml-1">
                      {section.title}
                    </Text>
                  ))}
                </Animated.View>

                {/* Document Content */}
                <View className="gap-y-6">
                  {manualSections.map((section, index) => (
                    <Animated.View 
                      key={index} 
                      entering={FadeInDown.duration(200).delay(80 + index * 30)}
                    >
                      {/* Section Title */}
                      <Text className="text-base font-extrabold text-gray-900 mb-2">{section.title}</Text>
                      
                      {/* Section Content */}
                      {section.content ? (
                        <Text className={`text-xs ${isNative ? 'text-gray-600' : 'text-gray-500'} font-semibold leading-relaxed mb-3`}>
                          {section.content}
                        </Text>
                      ) : null}

                      {/* Screenshot for Section */}
                      {section.screenshot ? (
                        section.image ? (
                          <View className="mb-4 rounded-xl overflow-hidden border border-gray-200">
                            <ExpoImage source={section.image} style={{ width: '100%', aspectRatio: 390 / 700 }} contentFit="contain" />
                            <Text className="text-[9px] text-gray-400 font-medium text-center py-1 bg-gray-50">{section.screenshot}</Text>
                          </View>
                        ) : (
                          <View className="border-2 border-dashed border-gray-300 rounded-xl p-4 mb-3 items-center bg-gray-50/50">
                            <Ionicons name="camera-outline" size={28} color="#9CA3AF" />
                            <Text className="text-[10px] text-gray-400 font-semibold text-center mt-1.5 leading-relaxed">
                              [PENDIENTE: {section.screenshot}]
                            </Text>
                            <Text className="text-[9px] text-gray-300 font-medium mt-0.5">
                              manual-seccion-{index + 1}.png
                            </Text>
                          </View>
                        )
                      ) : null}

                      {/* Subsections */}
                      {section.subsections ? (
                        <View className="gap-y-4 mt-1 ml-2 pl-3 border-l-2 border-orange-200">
                          {section.subsections.map((sub, subIdx) => (
                            <View key={subIdx}>
                              <Text className="text-sm font-bold text-gray-800 mb-1.5">{sub.title}</Text>
                              <Text className={`text-xs ${isNative ? 'text-gray-600' : 'text-gray-500'} font-semibold leading-relaxed`}>
                                {sub.content}
                              </Text>
                              
                              {/* Numbered Steps */}
                              {sub.steps ? (
                                <View className="mt-2 gap-y-1.5">
                                  {sub.steps.map((step, stepIdx) => (
                                    <View key={stepIdx} className="flex-row items-start">
                                      <Text className="text-xs font-bold text-orange-500 mr-2 mt-0.5">{stepIdx + 1}.</Text>
                                      <Text className={`text-xs ${isNative ? 'text-gray-600' : 'text-gray-500'} font-semibold leading-relaxed flex-1`}>
                                        {step}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              ) : null}

                              {/* Screenshot for Subsection */}
                              {sub.screenshot ? (
                                sub.image ? (
                                  <View className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                                    <ExpoImage source={sub.image} style={{ width: '100%', aspectRatio: 390 / 700 }} contentFit="contain" />
                                    <Text className="text-[9px] text-gray-400 font-medium text-center py-1 bg-gray-50">{sub.screenshot}</Text>
                                  </View>
                                ) : (
                                  <View className="border-2 border-dashed border-gray-300 rounded-xl p-3 mt-3 items-center bg-gray-50/50">
                                    <Ionicons name="camera-outline" size={22} color="#9CA3AF" />
                                    <Text className="text-[10px] text-gray-400 font-semibold text-center mt-1 leading-relaxed">
                                      [PENDIENTE: {sub.screenshot}]
                                    </Text>
                                    <Text className="text-[9px] text-gray-300 font-medium mt-0.5">
                                      manual-seccion-{index + 1}-{subIdx + 1}.png
                                    </Text>
                                  </View>
                                )
                              ) : null}
                            </View>
                          ))}
                        </View>
                      ) : null}

                      {/* Section Divider */}
                      {index < manualSections.length - 1 && (
                        <View className="h-px bg-gray-200 mt-4" />
                      )}
                    </Animated.View>
                  ))}
                </View>

                {/* Support Box */}
                <TouchableOpacity 
                  onPress={() => Linking.openURL('mailto:reservafitgym@gmail.com')}
                  activeOpacity={0.7}
                >
                  <Animated.View 
                    entering={FadeInDown.duration(200).delay(500)} 
                    className="bg-orange-50 border border-orange-150 rounded-2xl p-4 mt-8 items-center"
                  >
                    <Ionicons name="mail-open-outline" size={24} color="#FF7A00" />
                    <Text className="text-xs font-bold text-gray-800 mt-2 text-center">¿Necesitas más ayuda?</Text>
                    <Text className="text-[10px] text-gray-500 mt-1 text-center font-semibold">Escríbenos a reservafitgym@gmail.com y te atenderemos a la brevedad.</Text>
                  </Animated.View>
                </TouchableOpacity>
              </>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
