# Deployment

Deploying an application depends on the host environment. Most shared hosts don't currently support node.js.

Heroku is a cloud-based hosting platform with support for Node.js.  It also supports Ruby, Clojure, Java, Python, and Scala.

Other hosting platforms include:  
  * [Joyent Node](https://no.de)  
  * [Windows Azure](http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/)  
  * [Amazon EC2](http://aws.amazon.com/ec2/)  

The level of effort for hosting in these platforms varies.  Heroku is relatively simple.

## Deploying to Heroku

For complete instructions, refer to [Heroku's Documentation](http://devcenter.heroku.com/articles/node-js).

Assuming you have already created your app and an account on Heroku, the next step is to install the [heroku-toolbelt](http://toolbelt.herokuapp.com/linux/readme). In Debian/Ubuntu, this can be accomplished with:  

    $ sudo -s
    $ echo "deb http://toolbelt.herokuapp.com/ubuntu ./" > /etc/apt/sources.list.d/heroku.list
    $ wget -q -O - http://toolbelt.herokuapp.com/apt/release.key | apt-key add -
    $ apt-get update
    $ apt-get install heroku-toolbelt

Once installed, run the command `heroku login` and follow the prompts.

Next, in the root of your app directory, you will need to create a _Procfile_ file containing:

    web: node app.js

In this file, `node app.js` is the command you would normally use to run your app locally.  If your app requires parameters, either enter those on this line or modify your script to read defaults from `env`.

The Heroku documentation for deploying a node.js suggests you test the _Procfile_ using *foreman*.  This isn't a necessity.  However, if you want to install *foreman*, instructions for Ubuntu can be found [here](http://theforeman.org/projects/foreman/wiki/Debian-Ubuntu_installation_by_packages).

Next, you'll need to create a cedar stack and push your code to heroku:

    $ heroku create --stack cedar
    $ git push heroku master

You'll also need to configure some settings on heroku using the toolbelt.  You'll need to set web scaling to 1 and `NODE_ENV=production`:  

    $ heroku ps:scale web=1
    $ heroku config:add NODE_ENV=production

With the heroku toolbelt, you can also run commands within your cedar stack.  Try the following to become familiar with the toolbelt:  

    $ heroku ps
    $ heroku logs
    $ heroku run node

Heroku also offers free database addons (postgresql, redistogo, etc.). There are also services such as [Iris Couch](http://www.iriscouch.com/) which offer free services that are not tied to the heroku service.

At any time, you can login to heroku.com and modify settings for your newly-created cedar stack.  You can also opt-in to logging, notifications, and a plethora of other free and paid services.