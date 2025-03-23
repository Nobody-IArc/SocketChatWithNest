import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // express 서버 사용을 위해 추가
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static')); // 정적 파일 경로 지정
  await app.listen(process.env.PORT || 3000); // 환경 변수 PORT 가 없을 시 3000번 포트에서 실행
}
void bootstrap();
