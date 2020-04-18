var mustache = require('mustache')
var fs = require('fs')
var path = require('path')
const html2pug = require('html2pug')
var SVGO = require('svgo')
const svgoMono = new SVGO({
  plugins: [
    { cleanupAttrs: true },
    { removeDoctype: true },
    { removeXMLProcInst: true },
    { removeComments: true },
    { removeMetadata: true },
    { removeTitle: true },
    { removeDesc: true },
    { removeUselessDefs: true },
    { removeEditorsNSData: true },
    { removeEmptyAttrs: true },
    { removeHiddenElems: true },
    { removeEmptyText: true },
    { removeEmptyContainers: true },
    { removeViewBox: false },
    { cleanupEnableBackground: true },
    { convertStyleToAttrs: true },
    { convertColors: false },
    { convertPathData: true },
    { convertTransform: true },
    { removeUnknownsAndDefaults: true },
    { removeNonInheritableGroupAttrs: true },
    { removeUselessStrokeAndFill: true },
    { removeUnusedNS: true },
    { cleanupIDs: true },
    { cleanupNumericValues: true },
    { moveElemsAttrsToGroup: true },
    { moveGroupAttrsToElems: true },
    { collapseGroups: true },
    { removeRasterImages: false },
    { mergePaths: false },
    { convertShapeToPath: true },
    { sortAttrs: true },
    { removeDimensions: true },
    {
      removeAttrs: { attrs: '(stroke|fill)' },
    },
  ],
})

const svgo = new SVGO({
  plugins: [
    { cleanupAttrs: true },
    { removeDoctype: true },
    { removeXMLProcInst: true },
    { removeComments: true },
    { removeMetadata: true },
    { removeTitle: true },
    { removeDesc: true },
    { removeUselessDefs: true },
    { removeEditorsNSData: true },
    { removeEmptyAttrs: true },
    { removeHiddenElems: true },
    { removeEmptyText: true },
    { removeEmptyContainers: true },
    { removeViewBox: false },
    { cleanupEnableBackground: true },
    { convertStyleToAttrs: true },
    { convertColors: false },
    { convertPathData: true },
    { convertTransform: true },
    { removeUnknownsAndDefaults: true },
    { removeNonInheritableGroupAttrs: true },
    { removeUselessStrokeAndFill: true },
    { removeUnusedNS: true },
    { cleanupIDs: true },
    { cleanupNumericValues: true },
    { moveElemsAttrsToGroup: true },
    { moveGroupAttrsToElems: true },
    { collapseGroups: true },
    { removeRasterImages: false },
    { mergePaths: false },
    { convertShapeToPath: true },
    { sortAttrs: true },
    { removeDimensions: true },
    {
      removeAttrs: {},
    },
  ],
})

const iconPath = process.argv[2] || `${process.env.INIT_CWD}/svgs`
var files = fs
  .readdirSync(iconPath)
  .filter(file => file.toLowerCase().endsWith('svg'))
  .map(async f => {
    const filePath = `${iconPath}/${f}`
    const data = fs.readFileSync(filePath)
    const filePathInfo = path.parse(filePath)
    let svgName = filePathInfo.name.replace(/ /g, '-').toLowerCase()
    let optimized = null
    if (svgName.startsWith('icons8-')) {
      svgName = svgName.replace(/icons8-/i, '')
      optimized = await svgoMono.optimize(data, { path: `${iconPath}/${f}` })
    } else if (svgName.startsWith('icon-')) {
      svgName = svgName.replace(/icon-/i, '')
      optimized = await svgoMono.optimize(data, { path: `${iconPath}/${f}` })
    } else {
      optimized = await svgo.optimize(data, { path: `${iconPath}/${f}` })
    }
    const outputFolder = path.join(filePathInfo.dir, 'export')
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder)
    }
    var outputFilePath = path.join(outputFolder, filePathInfo.name + '.svg')
    console.log(outputFilePath)
    fs.writeFile(outputFilePath, optimized.data, () => {})
    const html = optimized.data.replace(
      /<svg/i,
      `<svg v-if="props.name=='${svgName}' && props.visible!==false" :data-cy-svgs="props.dataCy || '${svgName}'" `,
    )
    let pug = html2pug(html, { fragment: true, doubleQuotes: true })
      .replace(/\\'/g, `'`)
      .replace(/\n/g, '\n  ')
    return {
      svgName,
      pug,
    }
  })
var vueFileTemplate = `<script>
export default{
  props: ['name', 'classes', 'visible', 'dataCy'],
  name: 'svgs',
}
{{#items}}
// {{{ svgName }}}
{{/items}}
</script>
<template functional lang='pug'>
div.svgs(:class="props.name +  ' ' + (props.classes || '')" v-on="listeners['onClick'] ? { click: listeners['onClick'] } : {}")
{{#items}}
  {{{ pug }}}
{{/items}}
</template>
<style lang="postcss">
.svgs {
  display: inline-block;
  & svg {
    vertical-align: middle;
    height: 1em;
  }
}
</style>

`

Promise.all(files).then(items => {
  var jsFile = mustache.render(vueFileTemplate, { items })
  fs.writeFileSync('./src/components/svgs.vue', jsFile)
})
