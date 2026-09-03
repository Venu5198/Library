# @myorg/dummy-lib

A sample reusable utility library published to our local Verdaccio registry (`http://localhost:4873`).

## Installation

Ensure your `.npmrc` has the `@myorg` scope configured:
```ini
@myorg:registry=http://localhost:4873
```

Install the package:
```bash
npm install @myorg/dummy-lib
```

## Usage

```ts
import { greet, calculateDiscount, generateSlug, formatCurrency } from "@myorg/dummy-lib";

console.log(greet("Developer"));
// Output: Hello, Developer! Welcome to @myorg/dummy-lib.

const discount = calculateDiscount(100, 20);
console.log(discount.finalPrice); // 80

console.log(generateSlug("My First Custom Package!"));
// Output: my-first-custom-package

console.log(formatCurrency(1249.99, "USD"));
// Output: $1,249.99
```
