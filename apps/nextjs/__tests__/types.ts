/**
 * @testing-library/jest-dom/vitestはグローバルな型定義を拡張する
 * vitestワークスペースにインストールされており,react-setup.tsでimportされるためテストの実行には問題がない
 * しかし、react-setup.ts は vitest パッケージ側 にあるため、Next.js ワークスペースの
 * TypeScript コンパイラがそのファイルをプロジェクトに含めておらず、型拡張が認識されない
 * そのため、直接の依存には追加せずに型のimportだけを行う
 */
import "@testing-library/jest-dom/vitest";
