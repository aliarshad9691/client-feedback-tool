const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'client-feedback-tool.js',
    library: 'ClientFeedbackTool',
    libraryTarget: 'var'
  },
};