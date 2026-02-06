# TS Service Locator

A simple and robust TypeScript Service Locator implementation for managing and retrieving service instances within your application. This pattern helps decouple components by centralizing service registration and retrieval.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Example](#example)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Singleton Pattern**: Ensures only one instance of the Service Locator exists throughout the application.
- **Type-Safe Retrieval**: Generic `get<T>()` method provides type safety when retrieving services.
- **Service Registration**: Easily register any service instance with a unique key.
- **Existence Check**: Quickly check if a service is already registered.
- **Warning on Overwrite**: Notifies if a service is being overwritten during registration.
- **Clear Error Handling**: Throws an error if a requested service is not found.

## Installation

To use this service locator in your TypeScript project, you can integrate the `ServiceLocator` class directly.

First, ensure you have TypeScript installed:
```bash
npm install -g typescript
```

Then, you can copy the `src/index.ts` file into your project or compile it into a JavaScript module.

## Usage

### 1. Define your Services

Start by defining interfaces for your services and implementing them.

```typescript
// interfaces.ts
interface ILogger {
  log(message: string): void;
  error(message: string): void;
}

interface IApiService {
  fetchData(): Promise<string[]>;
}

// implementations.ts
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
```

### 2. Get the Service Locator Instance

The `ServiceLocator` uses a singleton pattern, so you always retrieve the same instance.

```typescript
import { ServiceLocator, ILogger, IApiService } from './ServiceLocator'; // Adjust path as necessary

const locator = ServiceLocator.getInstance();
```

### 3. Register your Services

Register your service instances with a unique string key and the instance itself.

```typescript
locator.register<ILogger>('Logger', new ConsoleLogger());
locator.register<IApiService>('ApiService', new MockApiService());
```

### 4. Retrieve and Use Services

Retrieve services using their registered key and the expected type.

```typescript
const logger = locator.get<ILogger>('Logger');
logger.log('Services registered and retrieved.');

const apiService = locator.get<IApiService>('ApiService');

async function runApp() {
  logger.log('Fetching data...');
  const data = await apiService.fetchData();
  logger.log(`Fetched data: ${data.join(', ')}`);
}

runApp();
```

### 5. Check for Service Existence

You can check if a service exists before attempting to retrieve it.

```typescript
if (locator.has('Logger')) {
  logger.log('Logger service exists in locator.');
}
```

### 6. Handling Non-Existent Services

Attempting to get a non-existent service will throw an error.

```typescript
try {
  locator.get<any>('NonExistentService');
} catch (e) {
  logger.error(`Attempted to get non-existent service: ${(e as Error).message}`);
}
```

## API

### `IServiceLocator` Interface

- `register<T>(key: string, instance: T): void`: Registers a service instance with a given key. If a service with the same key already exists, a warning is logged, and the service is overwritten.
- `get<T>(key: string): T`: Retrieves a service instance by its key. Throws an `Error` if the service is not found.
- `has(key: string): boolean`: Checks if a service with the given key is registered. Returns `true` if it exists, `false` otherwise.

### `ServiceLocator` Class

- `static getInstance(): ServiceLocator`: Returns the singleton instance of the `ServiceLocator`.

## Example

The `src/index.ts` file includes a complete example demonstrating the usage of the `ServiceLocator` with `ILogger` and `IApiService` interfaces and their implementations.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details (if applicable).
