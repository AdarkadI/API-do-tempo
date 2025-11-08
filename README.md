
## PROJETO: API DO TEMPO

DESCRIÇÃO GERAL
O projeto "API do Tempo" é composto por dois módulos independentes:

1. BACK-END desenvolvido em Java com Spring Boot, responsável por consultar a API do OpenWeather e retornar informações sobre coordenadas e clima.
2. FRONT-END desenvolvido em React Native com Expo, que consome a API Java e exibe os dados de forma interativa e estilizada.

O objetivo é permitir que o usuário informe uma cidade ou CEP e obtenha a latitude e longitude correspondentes, além da temperatura atual e outras informações climáticas do local.

---

REQUISITOS

Para rodar o back-end:

* Java 17 (ou superior)
* Maven 3.8 ou superior
* Conexão com a internet (para acessar a API do OpenWeather)

Para rodar o front-end:

* Node.js (versão 16 ou superior)
* Expo CLI instalado globalmente (npm install -g expo-cli)
* Emulador Android ou aplicativo Expo Go no celular
* O back-end deve estar rodando e acessível via rede local

---

CONFIGURAÇÃO DO BACK-END

1. Edite o arquivo src/main/resources/application.properties e configure:
   server.port=8081
   openweather.api.key=SUA_CHAVE_REAL_AQUI

   (A chave deve ser obtida no site [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys))

2. Compile e rode o projeto:
   mvn spring-boot:run

3. Endpoints disponíveis:
   POST /api/geocode  ->  Recebe { "q": "São Paulo,BR" } e retorna latitude e longitude.
   POST /api/weather  ->  Recebe { "lat": -23.55, "lon": -46.63 } e retorna informações do clima.

4. Exemplo de teste com curl:
   curl -X POST [http://localhost:8081/api/weather](http://localhost:8081/api/weather) -H "Content-Type: application/json" -d "{"lat": -23.55, "lon": -46.63}"

5. Resposta esperada:
   {
   "locationName": "São Paulo",
   "temp": 26.4,
   "feels_like": 27.1,
   "humidity": 60,
   "weather_description": "céu limpo"
   }

---

CONFIGURAÇÃO DO FRONT-END

1. Entre na pasta do front-end:
   cd front-end-API-do-tempo

2. Instale as dependências:
   npm install

3. Verifique o endereço de rede do back-end.
   Caso use emulador Android, defina no código:
   const BASE_URL = "[http://10.0.2.2:8081](http://10.0.2.2:8081)"

   Caso use um celular físico, substitua pelo IP local da sua máquina:
   const BASE_URL = "[http://192.168.x.x:8081](http://192.168.x.x:8081)"

   O valor deve ser alterado nos arquivos:

   * app/geocode.tsx
   * app/weather.tsx

4. Inicie o aplicativo:
   npm start

5. Escolha onde rodar:

   * Pressione "a" para abrir no emulador Android
   * Pressione "w" para abrir no navegador
   * Escaneie o QR Code com o aplicativo Expo Go (no celular)

---

FUNCIONAMENTO DO APP

Tela inicial:

* Apresenta o nome "API do Tempo"
* Possui dois botões:

  1. Buscar Coordenadas
  2. Ver Clima Manualmente

Tela de Coordenadas:

* O usuário digita o nome da cidade ou CEP (ex: São Paulo,BR)
* Ao clicar em "Buscar", o app consulta o endpoint /api/geocode
* Retorna latitude e longitude
* Após o retorno, o app navega automaticamente para a tela de clima

Tela de Clima:

* Mostra a latitude e longitude preenchidas automaticamente
* O usuário pode alterar os valores e clicar em "Buscar Clima"
* O app consulta o endpoint /api/weather e exibe:
  Temperatura atual
  Sensação térmica
  Umidade
  Descrição do tempo (ex: céu limpo, nublado etc)

---

ESTILO E INTERFACE

O aplicativo utiliza tons de verde como cor principal (#2ecc71).
O fundo é claro e limpo (#f7fdf8).
Botões têm sombras suaves e o layout é responsivo, adaptando-se a diferentes tamanhos de tela.
Em cada tela há botões de retorno e mensagens de erro amigáveis em caso de problemas de rede ou dados inválidos.

---

TESTES E ERROS COMUNS

1. Erro "Invalid API key"

   * A chave do OpenWeather não foi configurada ou ainda não foi ativada (pode demorar até 10 minutos após a criação).

2. Erro de conexão (Network error)

   * O back-end não está rodando.
   * A URL base (BASE_URL) está errada.
   * O celular e o computador não estão na mesma rede.

3. Retorno vazio no /api/geocode

   * O nome informado não foi reconhecido pela API do OpenWeather.

---

EXEMPLOS DE USO

Exemplo 1:
Entrada:  { "q": "Lisboa,PT" }
Saída:    { "name": "Lisboa", "lat": 38.7167, "lon": -9.1333, "country": "PT" }

Exemplo 2:
Entrada:  { "lat": 38.7167, "lon": -9.1333 }
Saída:    { "temp": 19.2, "feels_like": 19.0, "humidity": 78, "weather_description": "nuvens dispersas" }

---

CRÉDITOS E AUTORIA

Desenvolvido com:

* Java Spring Boot 2.7
* React Native com Expo SDK 48
* React Navigation 6
* API pública do OpenWeatherMap

O projeto foi criado com foco em simplicidade, legibilidade e integração direta entre front-end e back-end, sem bibliotecas externas desnecessárias.

---

FIM DO ARQUIVO


