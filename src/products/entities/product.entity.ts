import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductImage } from './'
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

  @ApiProperty({
    example: '6fe1ed8a-9a4e-4b04-82fb-4e947dd154f1',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product Tittle',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  title: string

  @ApiProperty({
    example: 0,
    description: 'Product Price'
  })
  @Column('float', {
    default: 0
  })
  price: number

  @ApiProperty({
    example: 'This is a Product description',
    description: 'Product Description'
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product SLug',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  slug: string

  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    default: 0
  })
  @Column('int',{
    default: 0
  })
  stock: number

  @ApiProperty({
    example: ['M', 'L', 'XL', 'XXL'],
    description: 'Product Sizes'
  })
  @Column('text', {
    array: true
  })
  sizes: string[]

  @ApiProperty({
    example: 'Women - Men',
    description: 'Product Gender'
  })
  @Column('text')
  gender: string

  @ApiProperty()
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[]

  @ApiProperty()
  @OneToMany(
    () => ProductImage, 
    (productImage) => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[]

  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
  user: User

  @BeforeInsert()
  checkSlugInsert() {
    if ( !this.slug) {
      this.slug = this.title
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
  }

  @BeforeUpdate()
  checkSlugUpdated() {
      this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '')
  }
}
