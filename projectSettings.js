
class SettingsConfig {
  constructor() {
    this.name = "s2016-debate";
    this.dependsOn = ["tbt-core", "tbt-analytics"];
    this.styles = ["s2016-debate/styles.scss"];
    this.scripts = [];
    this.assets = [];
    this.blocks = [
      "core/header.html",
      "ARTICLE",
      "tbt-core/comments.html",
      "core/footer.html",
      "tbt-analytics/omniture.html"
    ];



    this.assets = [
      "tbt-analytics/tracker.js",
    ];
    this.googleFileId = "1koLrvQsUlhPT-xSXB64N-NVxMFzNClSYXqX2ArggjaE";
  }
}

// DO NOT CHANGE ANYTHING BELOW THIS LINE
// These two lines are necessary for lede to pull in this module at runtime.
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SettingsConfig;
