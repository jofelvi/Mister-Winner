This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
el tipado debe ser estrico evita usar any y ten como regla hacer codigo que respete siempre las reglas del eslint
este esn un proyecto de rifas donde quiero implementar sorteos desde un panel admin, los usuarios puedes registrarse y logearse, 
en la seccion privada el debe tener el loyout un sidebar que sea bonito

hay que ajustar los estilos para hacer una web mas moderna

    en la carpeta types estan los tipos del modelo necesarios pueden agregarse mas

    Como regla de oro hay que mantener los princios SOLID y KISS y DRY aplicando Thinking react siempre


los sorteos tienen una fecha de inicio tentativa ya que solo se le da una fecha de inicio si ya alcanzaron el 80 % del total de los numero, hay que tener seguridad para evitar que los numeros se vendan 2 veces

en la carpeta de components y UI ya estan definidos los componentes base de la app para lo que es los formularios, y dentro de shared esta la implementacion de ellos, aca hay que ajustar los estilos de todos para que tengan el mismo estilo nuevo a implementar

hay que crear un estilo agradable que inspire confianza y que transmita seguridad Recuerda la app se llama Mister winner inpirate con eso

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.