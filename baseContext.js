const WEBHED = "Final debate"; // serves as social hed and analytics
const DESCRIPTION = "";
const URL = "";
const SOCIAL_IMG = ``;
const IMG_WIDTH = "1200"; //for social img
const IMG_HEIGHT = "630";
const AUTHOR = "Times Editorial Staff";
const YEAR = "2016";
const SECTION = "Breaking News";
const TITLE = `${WEBHED} | ${SECTION} | Tampa Bay Times`;

class ContextObject {
  constructor(){
    this.seo = {
      meta: [
        // COMMON
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          content: 'IE=edge',
          props: [
            {
              prop: 'http-equiv',
              val: 'X-UA-Compatible'
            }
          ],
        },
        {
          props: [
            {
              prop: 'charset',
              val: 'UTF-8'
            }
          ],
        },
        {
          name: 'description',
          content: DESCRIPTION
        },

        // TWITTER
        {
          name: "twitter:card",
          content: "summary_large_image"
        },
        {
          name: "twitter:site",
          content: "@TB_TIMES"
        },
        {
          name: "twitter:title",
          content: WEBHED
        },
        {
          name: "twitter:description",
          content: DESCRIPTION
        },
        {
          name: "twitter:image",
          content: SOCIAL_IMG
        },

        // OG
        {
          name: "og:url",
          content: URL
        },
        {
          name: "og:type",
          content: "article"
        },
        {
          name: "og:title",
          content: WEBHED
        },
        {
          name: "og:description",
          content: DESCRIPTION
        },
        {
          name: "og:image",
          content: SOCIAL_IMG
        },
        {
          name: "og:image:width",
          content: IMG_WIDTH
        },
        {
          name: "og:image:height",
          content: IMG_HEIGHT
        },
      ],
      title: TITLE,
      url: URL,
      image: SOCIAL_IMG,
      webhed: WEBHED
    };

    this.headLinks = [
      '<script type="text/javascript" src="http://cdn.gigya.com/js/gigya.js?apiKey=2_XVvcxIxG8cRaBYq3JyWKVSDhHbrBDJ78qOERcKaeWBTVH-aNjJPONe-sqQjvKmOp"></script>'
      ,'<script type="text/javascript" src="assets/tbt-analytics/tracker.js"></script>'
    ];

    this.bodyLinks = [];

    this.omniture = {
      section: SECTION,
      byline: AUTHOR,
      year: YEAR
    };

    this.baseHref = "//tampabay.com";
    this.projectHref = "//";
    this.brandName = "Tampa Bay Times";
    this.brandLogoWideWhite = "http://tampabay.com/projects/assets/tampabaytimes_white.svg";
    this.brandLogoSmallWhite = "http://tampabay.com/projects/assets/logo-t.svg";
    this.brandLogoStackedWhite = "http://tampabay.com/projects/assets/times_logo_stacked_white.svg";
    this.shareSocialIconsFbUp = "//www.tampabay.com/projects/assets/sharing/fb_wh.svg"
    this.shareSocialIconsFbOver = "//www.tampabay.com/projects/assets/sharing/fb_blWh.svg"
    this.shareSocialIconsTwUp = "//www.tampabay.com/projects/assets/sharing/tw_wh.svg"
    this.shareSocialIconsTwOver = "//www.tampabay.com/projects/assets/sharing/tw_blWh.svg"
    this.shareSocialIconsEmailUp = "//www.tampabay.com/projects/assets/sharing/email_wh.svg"
    this.shareSocialIconsEmailOver = "//www.tampabay.com/projects/assets/sharing/email_blWh.svg"
    this.shareSocialIconsMoreUp = "//www.tampabay.com/projects/assets/sharing/more_wh.svg"
    this.shareSocialIconsMoreOver = "//www.tampabay.com/projects/assets/sharing/more_blWh.svg"
  };
}

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContextObject;
