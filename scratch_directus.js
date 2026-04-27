import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';

const directus = createDirectus('https://direk.kiryuuki.space')
  .with(staticToken('DpVCe1-NQ23Y2VS2205a25U5ag5XCqye'))
  .with(rest());

async function main() {
  try {
    const data = await directus.request(readItems('about'));
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
  }
}

main();
