import tseslint from 'typescript-eslint';
import configs from './configs/eslint.mjs';

export default tseslint.config(
  ...configs,
  {
    rules: {
      'no-console': 'off',
      'no-undefined': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    }
  }
)