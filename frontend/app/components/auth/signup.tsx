import type { ComponentProps } from 'react';

import { type VariantProps, cva } from 'class-variance-authority';
import { UserRoundPlus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/ui/button';

const buttonVariants = cva(undefined, {
  variants: {
    variant: {
      header:
        'hover:bg-primary hover:shadow-primary/30 transition-transform duration-200 hover:scale-110 hover:shadow-lg active:scale-100 dark:hover:shadow-xl dark:hover:shadow-white/20',
      homepage: '',
    },
  },
  defaultVariants: {
    variant: 'header',
  },
});

export function SignupButton({
  variant,
  className,
}: Omit<ComponentProps<typeof Button>, 'variant'> &
  VariantProps<typeof buttonVariants>) {
  return (
    <Button
      size={variant === 'homepage' ? 'lg' : undefined}
      className={twMerge(buttonVariants({ variant, className }))}
    >
      <UserRoundPlus />
      <span className="hidden lg:block">Registrieren</span>
    </Button>
  );
}
