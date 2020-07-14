const { withAnt } = require("@mies-co/next-ant");

module.exports = withAnt({
  ant: {
    theme: "./public/static/styles/theme.scss",
  },
});
