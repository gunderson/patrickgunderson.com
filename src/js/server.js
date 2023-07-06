const express = require('express');
const sassMiddleware = require('node-sass-middleware');
const _ = require('lodash');
const app = express();
const port = process.env.PORT || 3000;
const PATH = require("path");

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
app.use('/js', express.static(__dirname));
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
  // develop home page data
  let siteData = require(PATH.join(__dirname, '../data/site-data.json'));
  let projectData = _.mapValues(siteData.frontPage, section => {
    return _.map(section, slug => {
      return _.find(siteData.projects, {slug: slug});
    });
  });

  res.locals = _.extend(res.locals, projectData);
  res.render('index');
});

app.get('/adjacent/:slug', (req, res) => {
  res.send(getAdjacent(req.params.slug));
});

app.get('/scroll/:tags', (req, res) => {
  let dataList = getByTags(req.params.tags);
  res.locals.tags = dataList.tags
  res.locals.projects = dataList.projects;

  res.render('scroll');
});

app.get('/list/:tags', (req, res) => {
  let dataList = getByTags(req.params.tags);
  res.locals.tags = dataList.tags
  res.locals.projects = dataList.projects;

  res.render('list');
});

app.get('/list-data/:tags', (req, res) => {
  let dataList = getByTags(req.params.tags);
  res.send(dataList);
});


app.get('/data/:slug', (req, res) => {
  let siteData = require(PATH.join(__dirname, '../data/site-data.json'));
  let data = _.find(siteData.projects, {slug: req.params.slug});
  res.send(data);
});


app.get('/:section', (req, res) => {
  res.render(req.params.section);
});

app.get('/:section/:slug', (req, res) => {
  // TODO: validate section and slug
  let siteData = require(PATH.join(__dirname, '../data/site-data.json'));
  res.locals.adjacent = getAdjacent(req.params.slug);
  let data = _.find(siteData.projects, {slug: req.params.slug});
  console.log(data);
  res.locals = _.extend(res.locals, data);
  let template = data.template || req.params.section;
  res.render(template);
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


function getAdjacent(slug){
  let siteData = require(PATH.join(__dirname, '../data/site-data.json'));

  let projectData = siteData.projects;
  let currentIndex = _.findIndex(projectData, {slug: slug});

  let nextIndex = currentIndex + 1;
  let prevIndex = currentIndex - 1;

  if (nextIndex >= projectData.length){
    nextIndex = 0;
  }
  if (prevIndex < 0){
    prevIndex = projectData.length - 1;
  }

  return {
    next: projectData[nextIndex],
    prev: projectData[prevIndex]
  }
}

function getByTags(tags){
  let siteData = require(PATH.join(__dirname, '../data/site-data.json'));
  let tagArray = tags.split(",");
  
  tagArray = _.map(tagArray, tag => _.toLower(tag));

  let projects = _.filter(siteData.projects, project => {
    return _.intersection(project.tags, tagArray).length === tagArray.length;
  });

  tagArray = _.map(tagArray, tag => _.upperFirst(tag));
  return {
    tags: tagArray.join(", "),
    projects:projects
  };
}

