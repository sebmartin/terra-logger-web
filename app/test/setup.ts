import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";
import { resetStores } from "./test-utils";

vi.mock("@/app/services/SiteService", () => ({
  siteService: {
    list: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/app/services/LayerService", () => ({
  layerService: {
    listForSite: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    get: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("@/app/services/FeatureService", () => ({
  featureService: {
    list: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    get: vi.fn().mockResolvedValue(null),
  },
}));

const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

const ResizeObserverMock = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

beforeEach(() => {
  resetStores();
  Object.defineProperty(window, "matchMedia", {
    value: matchMediaMock,
    writable: true,
  });
  global.ResizeObserver = ResizeObserverMock;
});
