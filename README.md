# Teste técnico da Shopper
No repositório há o backend na pasta server e o frontend na pasta client.
No backend utilizei NestJs com TypeOrm e no frontend utilizei React com Vite e styled-components.
### Backend:
```
cd server
```
```
yarn
```
```
yarn start
```
É necessário adicionar ao `.env` as credenciais do banco de dados, mas existe um `.env.example` para auxiliar o entendimento.

### Frontend:
```
cd client
```
```
yarn
```
```
yarn dev
```
É necessário adicionar ao `.env` a url em que o backend está rodando, por padrão o Nest roda na porta 3000, então é necessário adicionar a url correta ao `.env`, mas, novamente, existe, também o `.env.example`.
Não esqueça de desabilitar o `cors` ;)
