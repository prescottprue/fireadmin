import fs from 'fs'
import { parse } from 'path'
import { compileFromFile } from 'json-schema-to-typescript'

fs.readdirSync('./src/schemas').forEach(file => {
  console.log(file);
  const { name: fileName } = parse(file)
  compileFromFile(`${process.cwd()}/src/schemas/${file}`, { bannerComment: `/**\n\t* Value representing a ${fileName}.\n\t*/` })
  .then(ts => fs.writeFileSync(`${process.cwd()}/src/types/${fileName}.d.ts`, ts))
});
