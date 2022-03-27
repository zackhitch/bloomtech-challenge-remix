# Welcome to Zack Hitchcock's BloomTech Challenge!

### This challenge was completed with Remix

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm install
npm run dev
```

This starts the app in development mode, rebuilding assets on file changes.

## API

There are a few endpoints which will return data in either JSON or CSV

as specified by the user in the parameters.

- `$HOST/api/format/$FORMAT_TYPE/gender/$GENDER_TYPE`

  - Where `$HOST` is either `localhost` during development or a url when deployed
  - `$FORMAT_TYPE` may be either `json` or `csv` for the preferred return format
  - `$GENDER_TYPE` may be either `female` or `male`

- `$HOST/api/format/$FORMAT_TYPE/gender/$GENDER_TYPE/location/$LOCATION_TYPE`
  - Where `$HOST, $FORMAT_TYPE, and $GENDER_TYPE` are the same as above
  - `$LOCATION_TYPE` may be either `country` or `us` where 'country' returns global results and 'us' returns US state results

## Deployment

First, build the app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

To deploy, you need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When starting with `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
