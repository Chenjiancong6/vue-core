import config from '@/components/scaleConfig';

export const scale = (pixelSize: number) => {
  return (config.sizeScale || config.fontSizeScale || 1) * pixelSize;
};
