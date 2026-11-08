# Criterio de puntaje de proyectos

Cada repositorio recibe de 0 a 100 puntos según qué tan fácil es **evaluarlo**
(no qué tan famoso es). Los pesos viven en
`src/features/projects/scoring/config.ts`.

| Señal              | Puntos | Regla                                                                                   |
| ------------------ | ------ | --------------------------------------------------------------------------------------- |
| Demo online        | 25     | El campo `homepage` del repo no está vacío                                              |
| README             | 20     | El repo tiene README                                                                    |
| Descripción        | 15     | La descripción tiene 20 caracteres o más                                                |
| Actividad reciente | 20     | Completo hasta 90 días desde el último push; baja en línea recta hasta 0 a los 730 días |
| Topics             | 10     | Proporcional hasta 3 topics (1 -> 3, 2 -> 7, 3 o más -> 10)                             |
| Estrellas + forks  | 10     | Escala logarítmica; llega al máximo con 50 en total                                     |

**Desempate:** mayor puntaje -> push más reciente -> nombre alfabético.

El puntaje decide el orden **dentro de lo que no está fijado ni excluido** (ver
`docs/content-guide.md` y la story de curación manual).
