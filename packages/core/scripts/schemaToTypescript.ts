import fs from 'fs'
import { parse } from 'path'
import { compileFromFile } from 'json-schema-to-typescript'

fs.readdirSync('./src/schemas').forEach(file => {
  console.log(file);
  const { name: fileName } = parse(file)
  const resultPath = `${process.cwd()}/src/types/${fileName}.ts`
  if (fs.existsSync(resultPath)) {
    console.log(`${resultPath} already exists, skipping`)
    return null
  }
  compileFromFile(`${process.cwd()}/src/schemas/${file}`, { bannerComment: `/**\n\t* Value representing a ${fileName}.\n\t*/` })
  .then(ts => fs.writeFileSync(resultPath, ts))
});
