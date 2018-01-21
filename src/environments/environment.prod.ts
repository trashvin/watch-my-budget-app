declare const require: any;
export const environment = {
  production: true,
  version: require("../../package.json").version,
  seed_data: false,
  stitch_app_id: "watch-my-budget-zarlc",
  db_name: "watch-my-budget",
  event_collection: "events",
  log_level: 0 , // 0 - prod (only error) ; 1-error + warn + info ; 2 - all
  copyright: "2018"
};
