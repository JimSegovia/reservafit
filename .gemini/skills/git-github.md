---
name: git-github
description: Reglas de Conventional Commits en español y comandos para subir cambios a GitHub.
---
# Convención de Commits (Conventional Commits) y GitHub

Siempre que vayas a realizar un commit, DEBES seguir este formato estrictamente en español:

`<tipo>(<scope>): <descripción corta en español>`

### Tipos de Commit

| Tipo | Cuándo Usarlo |
|---|---|
| feat | Nueva funcionalidad (historia de usuario) |
| fix | Corrección de un bug |
| docs | Cambios en documentación |
| style | Cambios de formato/estilo (sin lógica) |
| refactor | Refactorización de código sin nueva funcionalidad |
| chore | Tareas de mantenimiento (dependencias, configs) |

### Ejemplos

- feat(auth): agregar pantalla de registro con email y contraseña
- fix(dashboard): corregir error al cargar datos del usuario
- docs(readme): actualizar instrucciones de instalación
- chore(deps): actualizar expo a la versión 54.0.33

### Reglas Adicionales

- **Commits Atómicos:** Si hay múltiples cambios independientes en el proyecto (por ejemplo, dependencias, nuevas funciones web, documentación, etc.), **DEBES dividir los cambios en múltiples commits individuales**. Agrupa los archivos lógicamente y haz un commit por cada grupo. NUNCA hagas un solo commit gigante ("monolítico") que mezcle diferentes tipos de tareas.

---

## Flujo de Trabajo con Git y GitHub

Cuando necesites subir cambios al repositorio remoto en GitHub, sigue estos pasos:

1. **Agregar los archivos al área de preparación (stage):**
   ```bash
   git add <archivo1> <archivo2>
   ```

2. **Realizar el commit siguiendo la convención:**
   ```bash
   git commit -m "<tipo>(<scope>): <descripción corta en español>"
   ```

3. **Subir los cambios a GitHub:**
   ```bash
   git push
   ```
