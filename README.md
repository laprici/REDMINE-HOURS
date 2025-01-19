# Reminder-Bots

Este repositorio contiene dos bots desarrollados en Node.js que ayudan a automatizar tareas diarias:

1. **Bot de Redmine**: Recuerda ingresar las horas trabajadas en el sistema Redmine.
2. **Bot del Clima**: Proporciona información climática actualizada y envía recordatorios sobre el uso de protector solar.

---

## Características

### Bot de Redmine
- Recordatorios automatizados para ingresar las horas trabajadas.
- Integración con la API de Redmine.
- Notificaciones enviadas a través de Google Chat.

### Bot del Clima
- Obtiene datos climáticos actualizados de la API de OpenWeather o servicios similares.
- Calcula y analiza índices UV.
- Genera mensajes personalizados que incluyen recomendaciones sobre el uso de protector solar.
- Notificaciones enviadas como card para Google Chat.

---

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/reminder-bots.git
   cd reminder-bots
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```env
   #redmine
   API_KEY_REDMINE=
   URL_REDMINE=
   USER_ID=
   WEBHOOK_KEY=
   WEBHOOK_TOKEN=
   SPACE_REDMINE=
   #clima
   API_KEY_WEATHER=
   WEBHOOK_KEY_WEATHER=
   WEBHOOK_TOKEN_WEATHER=
   SPACE_WEATHER=
   ```

4. Ejecuta los bots:
   - **Bot de Redmine**:
     ```bash
     npm run bot:redmine
     ```
   - **Bot del Clima**:
     ```bash
     npm run bot:weather
     ```

---

## Uso

### Bot de Redmine
Este bot verifica periódicamente si las horas trabajadas han sido ingresadas en Redmine y envía recordatorios en caso de que falten.

- **Frecuencia por defecto**: De lunes a jueves a las 9:15 AM y 3:00 PM; los viernes a las 9:15 AM y 2:45 PM.


### Bot del Clima
El bot obtiene datos climáticos en tiempo real y genera recomendaciones personalizadas basadas en los índices UV.

- **Frecuencia por defecto**: Dos veces al día, a las 9:15 AM y 3:00 PM de lunes a jueves y a las 9:15 AM y 2:45 PM


---

## Ejemplo de salida

### Bot de Redmine
```
Nooooo!
🚨 Faltan horas por agregar

14-01-2025 (martes): Ni una horita registrada 😱
15-01-2025 (miércoles): Solo 1 hora registrada. Ponle empeño ✍️
```

### Bot del Clima
```
🕑  Hora
    5:37:00 p. m.

🌡️  Temperatura
    28°

☀️  Índice
    UV3.02 (Moderado)

💧  Humedad
    34%

El bronceado dura días; el daño, años. 
```

---

