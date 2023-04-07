import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService as NestConfigService,
} from '@nestjs/config';
import {
  ConfigService,
  DefaultConfig,
  GenericConstructor,
  getEnvFilePath,
} from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static forRoot<T extends DefaultConfig>(
    config: GenericConstructor<T>,
  ): DynamicModule {
    const configService = {
      provide: ConfigService,
      useFactory: (
        nestConfigService: NestConfigService,
      ): ConfigService<DefaultConfig> => {
        const configService = new ConfigService(nestConfigService);
        configService.setConfigClass(config);

        return configService;
      },
      inject: [NestConfigService],
    };

    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          envFilePath: getEnvFilePath(),
        }),
      ],
      exports: [configService],
      providers: [configService],
    };
  }
}
