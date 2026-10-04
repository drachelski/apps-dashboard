'use client';

import { styled } from '@mui/material/styles';

/**
 * Plain <img> with `sx` support. Unlike <Box component="img">, width/height stay HTML attributes
 * (Box turns them into CSS system props), so the browser can reserve space before the image loads.
 */
export const Img = styled('img')({});
