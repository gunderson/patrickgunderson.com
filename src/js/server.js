const express = require('express');
const sassMiddleware = require('node-sass-middleware');
const app = express();
const port = process.env.PORT || 3000;

app.use(
  sassMiddleware({
    src: __dirname + '/../sass',
    dest: __dirname + '/../../built/css',
    debug: true,
    indentedSyntax : true,
    // outputStyle: 'compressed',
    prefix: '/css'
  })
);

app.use(express.static(__dirname + '/../../public'));
app.use('/images', express.static(__dirname + '/../assets/images'));
app.use('/videos', express.static(__dirname + '/../assets/videos'));
app.use('/fonts', express.static(__dirname + '/../assets/fonts'));
app.use('/sounds', express.static(__dirname + '/../assets/sounds'));
app.use('/css', express.static(__dirname + '/../../built/css'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/../pug');

app.use((req, res, next) => {
  res.locals.version = require('../../package.json').version;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/:section', (req, res) => {
  res.render(req.params.section);
});

app.post('/github-webhook', (req, res) => {
  const { body } = req;
  if (body && body.repository && body.repository.name === 'patrickgunderson.com') {
    console.log('Received webhook for patrickgunderson.com');
    const { exec } = require('child_process');
    exec('git pull', (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing git pull:', error);
        return res.sendStatus(500);
      }
      console.log('Git pull successful');
      console.log(stdout);
      console.error(stderr);

      // Execute build script here
      exec('npm run build', (error, stdout, stderr) => {
        if (error) {
          console.error('Error executing build script:', error);
          return res.sendStatus(500);
        }
        console.log('Build script executed successfully');
        console.log(stdout);
        console.error(stderr);

        // Restart PM2 process here
        exec('pm2 restart patrickgunderson.com', (error, stdout, stderr) => {
          if (error) {
            console.error('Error restarting PM2 process:', error);
            return res.sendStatus(500);
          }
          console.log('PM2 process restarted successfully');
          console.log(stdout);
          console.error(stderr);

          res.sendStatus(200);
        });
      });
    });
  } else {
    console.log('Invalid webhook payload');
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
