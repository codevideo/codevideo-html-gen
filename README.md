# codevideo-html-gen

![NPM Version](https://img.shields.io/npm/v/@fullstackcraftllc/codevideo-html-gen)

Generates a standalone HTML file for a time travelable IDE experience.

## Usage

Install the package:

```shell
npm install @fullstackcraftllc/codevideo-html-gen
```

Consume it in any node script:

```typescript
const viewerHTML = buildViewerHTML(myActions);
fs.writeFileSync(
    path.join(htmlOutputDir, "ide-viewer.html"),
    viewerHTML,
    { encoding: "utf8" }
);
```

Where `myActions` is an array of `IAction` from `@fullstackcraftllc/codevideo-types`:

```typescript
interface IAction {
    name: string;
    value: string;
}
```

However, names are restricted to various IDE actions. See the []`@fullstackcraftllc/codevideo-types`]() package for more information.

## Local development usage

Install dependencies:

```shell
npm install
```

Run the tool:

```shell
npm start
```

Modify the actions you want to generate html for directly in `src/index.ts`.