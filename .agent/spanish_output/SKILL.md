---
name: spanish_output
description: Enforce Latin American Spanish for all walkthroughs and implementation plans.
---

# Spanish Output Skill

## Objetivo
Asegurar que toda la documentación generada (específicamente `walkthrough.md` e `implementation_plan.md`) esté escrita en **Español Latinoamericano**, independientemente del idioma de la solicitud del usuario.

## Instrucciones

1. **Idioma Obligatorio**: 
   - Todos los planes de implementación (`ArtifactType: implementation_plan`) y guías paso a paso (`ArtifactType: walkthrough`) DEBEN escribirse en español latinoamericano.
   - Evita el uso de modismos de España (e.g., "vuestro", "hacéis") o traducciones literales del inglés que suenen poco naturales.

2. **Tono y Estilo**:
   - Usar un tono profesional pero cercano, común en la industria tecnológica de LatAm.
   - Mantener términos técnicos en inglés si es el estándar de la industria (e.g., "framework", "bug", "deploy", "setup"), pero explicar el contexto en español si es necesario.

3. **Excepciones**:
   - Nombres de archivos, variables de código, comandos de terminal y fragmentos de código deben mantenerse en su idioma original (usualmente inglés).

## Ejemplo

**Incorrecto (Inglés):**
"I have updated the `code.html` file..."

**Incorrecto (Español España):**
"He actualizado vuestro fichero `code.html`..."

**Correcto (Español LatAm):**
"He actualizado el archivo `code.html`..."
