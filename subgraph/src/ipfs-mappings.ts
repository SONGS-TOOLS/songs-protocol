import {
  Bytes,
  dataSource,
  json,
  JSONValueKind,
} from '@graphprotocol/graph-ts';
import { TokenMetadata } from '../generated/schema';

export function handleTokenMetadata(content: Bytes): void {
  let tokenMetadata = new TokenMetadata(dataSource.stringParam());
  const value = json.fromBytes(content).toObject();
  if (value) {
    const image = value.get('image');
    const name = value.get('name');
    const description = value.get('description');
    const external_url = value.get('external_url');
    const animation_url = value.get('animation_url');
    const attributes = value.get('attributes');

    if (name && !name.isNull() && name.kind == JSONValueKind.STRING) {
      tokenMetadata.name = name.toString();
    }

    if (animation_url && animation_url.kind == JSONValueKind.STRING) {
      tokenMetadata.animation_url = animation_url.toString();
    }

    if (image && image.kind == JSONValueKind.STRING) {
      tokenMetadata.image = image.toString();
    }
    if (description && description.kind == JSONValueKind.STRING) {
      tokenMetadata.description = description.toString();
    }
    if (external_url && external_url.kind == JSONValueKind.STRING) {
      tokenMetadata.external_url = external_url.toString();
    }
    if (attributes && attributes.kind == JSONValueKind.ARRAY) {
      const attributesArray = attributes.toArray();
      const newArray = new Array<string>(attributesArray.length);
      for (let i = 0; i < attributesArray.length; i++) {
        const attribute = attributesArray[i].toObject();
        if (attribute) {
          const traitType = attribute.get('trait_type');
          const value = attribute.get('value');
          newArray[i] = '';

          if (traitType && value) {
            let valueString = '';
            if (value.kind == JSONValueKind.BOOL) {
              valueString = value.toBool().toString();
            } else if (value.kind == JSONValueKind.STRING) {
              valueString = '"' + value.toString() + '"';
            }

            const traitTypeString = traitType
              ? '"' + traitType.toString() + '"'
              : '';

            const entry =
              '{"trait_type": ' +
              traitTypeString +
              ', "value": ' +
              valueString +
              '}';
            newArray[i] = entry;
          }
        }
      }

      tokenMetadata.attributes = '[' + newArray.join(',') + ']';
    }

    tokenMetadata.save();
  }
}
