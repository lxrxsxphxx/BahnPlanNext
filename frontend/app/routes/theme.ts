import { createThemeAction } from 'remix-themes';

// import { themeAction } from '@/components/theme/action';
import { themeSessionResolver } from '@/sessions.server';

// export const action = themeAction;

export const action = createThemeAction(themeSessionResolver);
