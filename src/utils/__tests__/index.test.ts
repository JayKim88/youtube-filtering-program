import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatViewCount,
  formatSubscriberCount,
  formatRelativeTime,
  extractChannelId,
} from "../index";

describe("formatNumber", () => {
  it("formats numbers with Korean locale", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1000000)).toBe("1,000,000");
    expect(formatNumber("1234")).toBe("1,234");
  });
});

describe("formatViewCount", () => {
  it("formats view counts correctly", () => {
    expect(formatViewCount(1000)).toBe("1천");
    expect(formatViewCount(10000)).toBe("1만");
    expect(formatViewCount(100000000)).toBe("1억");
    expect(formatViewCount(150000000)).toBe("1.5억");
    expect(formatViewCount(999)).toBe("999");
  });

  it("handles string inputs", () => {
    expect(formatViewCount("10000")).toBe("1만");
  });
});

describe("formatSubscriberCount", () => {
  it("formats subscriber counts correctly", () => {
    expect(formatSubscriberCount(1000)).toBe("1천명");
    expect(formatSubscriberCount(10000)).toBe("1만명");
    expect(formatSubscriberCount(100000000)).toBe("1억명");
    expect(formatSubscriberCount(150000000)).toBe("1.5억명");
    expect(formatSubscriberCount(999)).toBe("999명");
  });

  it("handles string inputs", () => {
    expect(formatSubscriberCount("10000")).toBe("1만명");
  });
});

describe("formatRelativeTime", () => {
  it("formats relative time correctly", () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const lastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    expect(formatRelativeTime(yesterday.toISOString())).toBe("어제");
    expect(formatRelativeTime(lastWeek.toISOString())).toBe("7일 전");
    expect(formatRelativeTime(lastMonth.toISOString())).toBe("1개월 전");
    expect(formatRelativeTime(lastYear.toISOString())).toBe("1년 전");
  });
});

describe("extractChannelId", () => {
  it("extracts channel ID from various URL formats", () => {
    expect(extractChannelId("https://youtube.com/channel/UC123456789")).toBe(
      "UC123456789"
    );
    expect(extractChannelId("https://youtube.com/@username")).toBe("username");
    expect(extractChannelId("https://youtube.com/c/channelname")).toBe(
      "channelname"
    );
    expect(extractChannelId("https://youtube.com/user/username")).toBe(
      "username"
    );
    expect(extractChannelId("UC123456789")).toBe("UC123456789");
    expect(extractChannelId("@username")).toBe("username");
  });

  it("returns null for invalid URLs", () => {
    expect(extractChannelId("invalid-url")).toBeNull();
    expect(extractChannelId("https://google.com")).toBeNull();
    expect(extractChannelId("")).toBeNull();
  });
});
