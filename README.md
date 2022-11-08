# String Synth

Sintetizador de sonido con input de texto e interfaz gráfica.

Utiliza:
* [Web Audio API](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API)
* [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API)
* [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
* [Hydra Synth](https://github.com/hydra-synth/hydra)

## Ruteo de señal

![ruteo de señal](https://jusrecondo.github.io/string-synth/assets/ruteo.png)


## Utilización del instrumento

El aviso de "compartir pantalla" al cargar la página en el navegador se relaciona con las visuales, se recomienda compartir la misma ventana donde se ve el sintetizador.

![aviso visuales](https://raw.githubusercontent.com/JusRecondo/hosted-assets/main/1.png)

La utilización del sintetizador tan sencilla como se indica en el input de texto:

![texto](https://raw.githubusercontent.com/JusRecondo/hosted-assets/main/2.png) 

![play](https://raw.githubusercontent.com/JusRecondo/hosted-assets/main/3.png)

Un vez hecho esto, comenzará a producirse sonido: un sonido por cada caracter del texto ingresado, incluidos espacios y saltos de línea. Aparecerá un contador en la parte superior indicando el paso de los caracteres.
Mientras esto se reproduce es posible manipular el sonido a través de los controles que ofrece la interfaz gráfica (Ver “Interfaz gráfica y MIDI”).
Una vez se presionó “Play”, es posible borrar el texto y preparar un texto nuevo que puede reproducirse simultáneamente, en superposición. No se permite presionar Play si el recuadro esta vacío.

## Procesamiento de datos y generación de sonido

La síntesis y manipulación de sonido se realiza utilizando la [Web Audio API](https://www.w3.org/TR/webaudio/). En el módulo audio.js se encuentran las configuraciones y creación de nodos de ganancia, osciladores, filtro, reverb, compresión y paneo. 

En audio.js también se encuentran las funciones específicas creadas para este sintetizador.

El objeto “characters” (en utilities.js), contiene el conjunto de caracteres de texto que serán utilizados para procesar el input de texto en el sintetizador. Cada caracter es una key dentro de este objeto y se le ha asignado un número. 

Por ejemplo a la letra ‘s’ le corresponde el número 20. 

Actualmente hay mapeados 77 caracteres (incluyendo letras con y sin tildes, números, signos de puntuación, caracteres especiales, espacios en blanco y saltos de línea).

El número total de esta cantidad de caracteres (la cual puede y probablemente irá creciendo en el futuro), es mapeado a un rango de frecuencias, el cual esta establecido entre 40Hz y 900Hz. Este es el registro del sintetizador. 

Siguiendo el ejemplo de la letra “s”, la frecuencia resultante del mapeo actual del registro entre los 77 caracteres, es de 263.38Hz.

La envolvente dinámica de cada sonido consta de un Ataque inmediato y luego un release de duración variable para cada caracter.

En cuanto a la duración que tendrá cada sonido, es decir, su tiempo de release, este equivaldrá al valor resultante de dividir por dos el número correspondiente al caracter. En el ejemplo la letra “s”: al tener asignado el número 20 en el mapa, su duración será de 10 segundos.

La función encargada de “leer” cada caracter y efectuar los procesos que producen cada sonido se llama interpreter(). Al presionar el botón “Play”, todo el texto que esté dentro del input será tomado como un único dato de tipo string y será recorrido caracter por caracter utilizando la función interpreter(). 

Esta función utiliza un setTimeOut[^1] en conjunto con la recursión, es decir, la función interpreter() se vuelve a llamar a si misma luego de un cierto intervalo de tiempo y continúa haciéndolo hasta haber “interpretado” cada caracter del texto que fue ingresado. Hay una variable llamada “index” que sirve de contador para iterar sobre el string. 

Cada vez que se presiona el botón “Play”, este proceso comienza. Es posible hacerlo varias veces y entonces superponer reproducciones. 

En cada ejecución de interpreter() se dan los procesos de indeterminación[^2] que afectarán ciertos parámetros de los sonidos producidos, esto se ve reflejado en los parámetros que son pasados a la función createOsc(oscParams) para dar lugar al sonido en cada caso.

La función createOsc recibe un conjunto de parámetros para crear un nodo oscilador, un nodo de paneo y un nodo de ganancia, estos tres elementos componen la unidad de sonido producida por del sintetizador, es decir, se crea uno de estos conjuntos por cada caracter. Parámetros que recibe la función:

1. “frequency”: la frecuencia en Hz (que proviene del mapa de caracteres).
2. “detune”: una cantidad de detune (cuya unidad es el cent), esta variación en la afinación de cada sonido se extrae de la propiedad AudioContext.currentTime, que representa el tiempo transcurrido desde que se creó el contexto de audio (en segundos), en este caso es desde que carga la página. Por ejemplo, si han transcurrido 47.32 segundos desde que se cargo la página al momento de ejecutarse el carácter actual, entonces ese sonido tendrá ese valor como detune (en cents).
3. “pitchDirection”: una indicación de dirección (ascendente o descendente) que implicará un ascenso o descenso en la altura (en cents) desde el valor de la frecuencia asignado al oscilador hasta el valor de detune, es un glissando. Esta pendiente se prolonga durante todo el reléase del sonido. También depende del carácter. Actualmente, solo el caracter “.” (punto) genera un ascenso en el pitch.
4. “waveType”: forma de onda (triangular, cuadrada o diente de sierra), se elije de forma random para cada oscilador.
5. “duration”: será el tiempo para el release en la envolvente dinámica del sonido producido (el ataque es inmediato). Este valor se relaciona con el mapa de caracteres. 
6. “connection”: la conexión, es el nodo al cual se conectara el nodo de ganancia del oscilador, por defecto, se conectan todos a un Filtro LP (que puede manipularse desde la interfaz gráfica).
7. “pan” paneo, es un número random entre -1 y 1 (izquierda – derecha).
8. “movement”: movimiento, algunos sonidos se moverán en el estéreo y otros no (esto se determina también de forma random). Si el sonido tiene movimiento, entonces a lo largo de su duración se desplazará hasta el punto puesto de su posición inicial en el campo estéreo.

[^1]: Método nativo de JavaScript para que un código se ejecute luego de transcurrida una cantidad de milisegundos indicada.

[^2]: Para obtener valores “random” dentro de un rango y con o sin decimales, se utilizan sendas funciones getRandomValue(min, max) y getRandomValueWithDecimals(min, max), ambas se encuentras en el módulo utilities.js

Con respecto a los intervalos de tiempo entre la ejecución de un sonido y otro, estos también varían constantemente y son indeterminados. Sin embargo, esta indeterminación sucede dentro de un cierto rango que se puede modificar desde la interfaz gráfica.
El intervalo mínimo de tiempo ya esta seteado en 27 milisegundos y desde la interfaz gráfica con el control “Density” es posible variar el número máximo del rango entre 540 y 5000 milisegundos. Lo cual resulta en una mayor o menor densidad de sucesos en el tiempo.

Cada vez que termina de sonar un oscilador este es eliminado junto con las conexiones de los nodos de ganancia y paneo creados, con motivo de prevenir gastos innecesarios de memoria.

## Noise
El generador de ruido, produce ruido marrón el actúa modulando el volumen general de salida del sintetizador. A su vez, hay un LFO que está conectado al volumen del ruido y a la frecuencia de corte del filtro del ruido. Pueden modificarse varios parámetros de este LFO (forma de onda, cantidad, velocidad).
En el módulo noise.js se encuentra todo lo referido al generador de ruido. La función para crear el Brown Noise fue tomada de este artículo <https://noisehack.com/generate-noise-web-audio-api/>

## Otras funcionalidades

### Filtro

Todos los osciladores al ser creados con la función createOsc(oscParams), luego de conectarse a su nodo de ganancia y de paneo, se conectan a un Filtro Low Pass, cuyos parámetros de Frecuencia de corte y resonancia pueden modificarse desde la interfaz gráfica.

### Speak

Al presionar el botón “Speak”, comenzará la lectura del contenido que se encuentre en el campo de texto en ese momento a través de una voz sintética. Esto esta implementado con la Web Speech API. 
Es posible modificar el volumen o el rate de la voz, pero no el pitch o el tipo de voz. Además, estos parámetros pueden modificarse solo antes de comenzar la lectura, pero no durante. 
Si se presiona varias veces el botón “Speak”, no se superpondrán voces sino que comenzará la nueva lectura una vez finalice la anterior (tomando los valores que estén seteados en ese momento para el volumen y rate).
Esta funcionalidad no fue pensada como una característica principal sino como una textura más que puede añadirse a la sonoridad que se esta desarrollando, por eso mismo, en un principio el pitch y volumen estan seteados de forma que no permitan fácilmente el reconocimiento del texto que se esta leyendo.

## Interfaz gráfica y MIDI

Es posible manipular todos los controles utilizando el mouse, pad, teclado o pantalla táctil dependiendo el dispositivo.
También es posible enviar MIDI CC a la interfaz. En la sección MIDI, se pueden mapear knobs y faders de cualquier controlador MIDI.
Para realizar el mapeo del MIDI:
1. Conectar el controlador MIDI (hacerlo antes de abrir el navegador y cargar la página). En caso de que no funcione, cerrar el navegador y volver a abrirlo. Si el dispositivos es o no reconocido será notificado a través de la interfaz.
![aviso midi](https://raw.githubusercontent.com/JusRecondo/hosted-assets/main/4.png)
2. Mover la perilla o fader deseado en el controlador, el número de CC será mostrado aquí.
![mapeo](https://raw.githubusercontent.com/JusRecondo/hosted-assets/main/5.png)
3. Seleccionar el destino del mapeo y presionar en el botón “Assign”.
En caso de que ese CC ya este asignado a otro destino, aparecerá un mensaje de aviso y se dará la opción de borrar el mapeo.

Esta configuración MIDI quedará guardada localmente en el navegador, por lo tanto a menos que se borren los datos del localStorage, esta información persistirá aunque se cierre la página o el navegador.
Es posible borrar toda la configuración MIDI con el botón “Clear All”.

## Visuales

Las visuales de la página son generadas con [Hydra](https://hydra-book.glitch.me/), un sintetizador de visuales en tiempo real creado por [Olivia Jack](https://ojack.xyz/).
El código referido a estas visuales en particular se encuentra en el módulo “hydra.js”
Actualmente hay tres parámetros del audio que se relacionan con parámetros de las visuales: el volumen del ruido, el rate del LFO del ruido y la densidad (rango de intervalos de tiempo entre sonidos).