interface IServiceLocator {
  register<T>(key: string, instance: T): void;
  get<T>(key: string): T;
  has(key: string): boolean;
}

class ServiceLocator implements IServiceLocator {
  private static instance: ServiceLocator;
  private services = new Map<string, any>();

  private constructor() {} // Singleton pattern

  public static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  register<T>(key: string, instance: T): void {
    if (this.services.has(key)) {
      console.warn(`Service with key '${key}' is already registered. Overwriting.`);
    }
    this.services.set(key, instance);
  }

  get<T>(key: string): T {
    if (!this.services.has(key)) {
      throw new Error(`Service with key '${key}' not found.`);
    }
    return this.services.get(key) as T;
  }

  has(key: string): boolean {
    return this.services.has(key);
  }
}

// --- Example Usage ---

// Define some interfaces for our services
interface ILogger {
  log(message: string): void;
  error(message: string): void;
}

interface IApiService {
  fetchData(): Promise<string[]>;
}

// Implement our services
class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(`[INFO] ${message}`);
  }
  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

class MockApiService implements IApiService {
  async fetchData(): Promise<string[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(['data1', 'data2', 'data3']), 500);
    });
  }
}

// Get the singleton instance of the ServiceLocator
const locator = ServiceLocator.getInstance();

// Register services
locator.register<ILogger>('Logger', new ConsoleLogger());
locator.register<IApiService>('ApiService', new MockApiService());

// Use the services by retrieving them from the locator
const logger = locator.get<ILogger>('Logger');
logger.log('Services registered and retrieved.');

const apiService = locator.get<IApiService>('ApiService');

async function runApp() {
  logger.log('Fetching data...');
  const data = await apiService.fetchData();
  logger.log(`Fetched data: ${data.join(', ')}`);

  if (locator.has('Logger')) {
    logger.log('Logger service exists in locator.');
  }

  try {
    locator.get<any>('NonExistentService');
  } catch (e) {
    logger.error(`Attempted to get non-existent service: ${(e as Error).message}`);
  }
}

runApp();
