import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, IsUUID } from 'class-validator';
import { PaymentMethod } from 'src/core/types/payment.types';
import { PaymentStatus } from 'src/core/types/status.type';

export class CreatePaymentDto {
  @ApiProperty({
    example: '56b32c4e-1a45-4ff3-b7cf-28ccf7d80544',
    description: 'User subscription ID (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  user_subscription_id: string;

  @ApiProperty({
    example: 29.99,
    description: 'Amount paid in USD or local currency',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CARD
  })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({
    example: { card_last4: '1234', bank: 'Payme' }
  })
  @IsObject()
  payment_details: object;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    description: 'Payment status',
  })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    description: 'Transaction ID from payment gateway',
  })
  @IsString()
  external_transaction_id: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto){}
