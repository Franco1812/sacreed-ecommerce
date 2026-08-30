import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { StorageModule } from './storage/storage.module.js';
import { ProductosModule } from './productos/productos.module.js';
import { CombosModule } from './combos/combos.module.js';
import { PedidosModule } from './pedidos/pedidos.module.js';

@Module({
  imports: [PrismaModule, StorageModule, ProductosModule, CombosModule, PedidosModule],
})
export class AppModule {}
