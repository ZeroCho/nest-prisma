# nest 시작하기
```
nest new nest-prisma
```

# prisma 시작하기
```
npm install prisma typescript ts-node @types/node --save-dev
npx prisma init
npm install @prisma/client nestjs-prisma
```
prisma/schema.prisma와 .env 수정
```
npx prisma format
npx prisma generate
npx prisma migrate dev
```

## 초기 데이터 넣기
- prisma/seed.ts 작성
- package.json prisma 필드 추가
```
npx prisma db seed
```

## 스키마가 바뀔 때마다 클라이언트 재생성 및 마이그레이션 하기

개발 중일 때는
```
npx prisma generate
npx prisma migrate dev
```
- migration 시 migration.sql commit하는 것 잊지 말기!!!

실제로 배포한 서버에서는
```
npx prisma generate
npx prisma migrate deploy
```

[(참고)기존 프로젝트를 prisma로 전환하려면](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project)

## Prisma Extension
src/prisma.extension.ts 작성

app.module.ts
```
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
```

앞으로 사용할 때
```
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  
  method() {
    this.prismaService.client.model.method(...)
  }
```
# 서비스 개발하기
## ConfigService
```
npm i @nestjs/config
```
ConfigModule을 app.module.ts에 import
- isGlobal: true면 모든 곳에서 ConfigService inject 가능
## 미들웨어 넣기
```
npm i express-session passport cors redis connect-redis
npm i -D @types/express-session @types/cors @types/passport
```
app.module.ts에 configure

### redis 설치
windows는 memurai, 그 외는 redis 설치
```
brew install redis
```
## REST API 개발
```
nest g res users
nest g res posts
nest g res hashtags
nest g res chats
```
RouterModule로 등록하기
[글로벌로 등록도 가능](https://docs.nestjs.com/faq/global-prefix)
```
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
      },
    ]),
```

- 와일드카드 라우터 제일 뒤에 위치시키기

## 폼 만들기
DTO 작성 - 요청, 응답

### 밸리데이션
```
npm i class-validator class-transformer
```

## 로그인
```
npm i @nestjs/passport bcrypt passport-local
npm i -D @types/bcrypt @types/passport-local
```

### SNS 로그인
### JWT 토큰 로그인

## 문서화
```
npm i @nestjs/swagger
```

# 웹소켓 개발(Socket.io)
```
npm i @nestjs/websockets @nestjs/platform-socket.io
```

- namespace와 room으로 구성됨
    - namespace는 워크스페이스(ws-워크스페이스명, 예시:ws-sleact)
    - room은 채널, DM
- @WebSocketGateway({ namespace: '이름' 또는 정규표현식 })
- @WebSocketServer(): 서비스에서 의존성주입받아 사용할 소켓 서버 객체
- @SubscribeMessage(이벤트명): 웹소켓 이벤트리스너
    - @MessageBody(): 이벤트의 데이터가 의존성주입됨
- afterInit: 웹소켓 초기화가 끝났을 때
- handleConnection: 클라이언트와 연결이 맺어졌을 때
    - @ConnectedSocket(): socket을 의존성주입받을 수 있음
    - socket.emit으로 이벤트 전송 가능(이렇게 하면 모두에게 이벤트 전송)
    - socket.nsp: 네임스페이스 객체(socket.nsp.emit 하면 해당 네임스페이스 전체에게 이벤트 전송)
    - socket.nsp.name: 네임스페이스 이름
    - socket.id: 소켓의 고유 아이디(이걸 사용해서 1대1 메시지도 보낼 수 있음, socket.to(소켓아이디).emit)
- handleDisconnect: 클라이언트와 연결이 끊어졌을 때

ChatsModule에 이벤트모듈 넣기
EventsGateway 넣으면 안 됨!!!
eventsGateway: EventsGateway로 서비스에서 의존성주입 가능

# 배포
## 프론트
serve-static 모듈 세팅으로 프론트 서빙
```
npm i @nestjs/serve-static
```
