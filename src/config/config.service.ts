import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { getMetadataStorage, IsEnum, validateSync } from 'class-validator';

export type GenericConstructor<T> = new () => T;

export enum NodeEnv {
  TEST = 'test',
  PROD = 'prod',
}

export class DefaultConfig {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;
}

export function getEnvFilePath(): string {
  const nodeEnv = (process.env.NODE_ENV || NodeEnv.PROD) as NodeEnv;
  const config = new Map<NodeEnv, string>([
    [NodeEnv.TEST, '.env.test'],
    [NodeEnv.PROD, '.env'],
  ]);
  const env = config.get(nodeEnv);
  if (!env) {
    throw new Error(
      'You must provide NODE_ENV={test,prod} environment variable',
    );
  }
  return env;
}

@Injectable()
export class ConfigService<T extends DefaultConfig> {
  private configClass: GenericConstructor<T>;

  constructor(private readonly configService: NestConfigService) {
    this.checkNodeEnv();
  }

  setConfigClass(configClass: GenericConstructor<T>): void {
    this.configClass = configClass;
  }

  checkNodeEnv(): void {
    const nodeEnv = this.getRequired('NODE_ENV');
    if (!Object.values(NodeEnv).includes(nodeEnv as NodeEnv)) {
      throw new Error('Invalid NODE_ENV value');
    }
  }

  getConfig(): T {
    const configTest = new this.configClass();
    const metadataStorage = getMetadataStorage();
    const metadata = metadataStorage.getTargetValidationMetadatas(
      this.configClass,
      Object.getPrototypeOf(configTest),
      false,
      false,
      undefined,
    );

    for (const value of metadata) {
      const envValue = this.getOptional(value.propertyName);

      if (envValue) {
        (configTest as any)[value.propertyName] = isNaN(envValue as any)
          ? envValue
          : +envValue;
      }
    }

    const errors = validateSync(configTest);

    if (errors.length > 0) {
      throw new Error(
        `${errors.map((e) => e.property).join(', ')} fields are invalid`,
      );
    }

    return configTest;
  }

  private getOptional(name: string): string | undefined {
    return this.configService.get<string>(name);
  }

  private getRequired(name: string): string {
    const value = this.configService.get<string>(name);
    if (value == null) {
      throw new Error(`You must provide ${name} env variable.`);
    }
    return value;
  }
}
