const gulp = require("gulp");
const gulpFs = require("../gulplib/gulpfs");
const gulpWrite = require("../gulplib/gulpwrite");
const FIREBASE_JSON = "firebase.json";

/**
 * Overwrite Firebase JSON File
 */
gulp.task("overwrite-firebase-json", async function (done) {
  gulpWrite.taskName("overwrite-firebase-json");
  let packageJSON = gulpFs.JSONdata(`../seed/config/${FIREBASE_JSON}`, false);
  gulpFs.writeDistFile(
    `../${FIREBASE_JSON}`,
    JSON.stringify(packageJSON, null, 2)
  );
  done();
});

/**
 * gulp default task
 */
gulp.task(
  "default",
  gulp.series(gulp.parallel("overwrite-firebase-json"), function (done) {
    done();
  })
);
