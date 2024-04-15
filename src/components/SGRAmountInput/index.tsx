import { Input } from 'aelf-design';
import { ZERO } from 'constants/misc';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { isPotentialNumber } from 'utils';
import { ReactComponent as QuestionIcon } from 'assets/img/icons/question.svg';
import { ToolTip } from 'aelf-design';
export interface ISGRAmountInputProps {
  title?: string;
  tips?: string[];
  description?: string;
  className?: string;
  max?: string;
  min?: string;
  decimals?: number | string;
  onInvalidChange?: (isInvalid: boolean) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  status?: '' | 'warning' | 'error' | undefined;
  errorMessage?: string;
}

export interface ISGRAmountInputInterface {
  getAmount: () => string;
}

export const SGRAmountInput = forwardRef(
  (
    {
      title,
      tips,
      description,
      className,
      min = '0',
      max,
      decimals = '8',
      onInvalidChange,
      onChange: onChangeProps,
      placeholder,
      status = '',
      errorMessage = '',
    }: ISGRAmountInputProps,
    ref,
  ) => {
    const [amount, setAmount] = useState<string>('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '') setAmount('');
      if (!isPotentialNumber(value)) return;
      const decimalCount = value.split('.')[1]?.length || 0;

      if (ZERO.plus(decimals).lt(decimalCount)) return;

      const valueNumber = ZERO.plus(value);

      if (valueNumber.toFixed() === '0' && ZERO.plus(decimals).gt(decimalCount)) {
        setAmount(value);
        return;
      }

      if (valueNumber.lte(min)) return;
      // if (max && valueNumber.gt(max)) return;
      setAmount(value);
    };

    const getMax = useCallback(() => {
      if (max) setAmount(max);
    }, [max]);

    useEffect(() => {
      if (!onInvalidChange) return;
      if (amount === '') {
        onInvalidChange(true);
        return;
      }
      const valueNumber = ZERO.plus(amount);
      // if (valueNumber.lte(min) || (max && valueNumber.gt(max))) {
      if (valueNumber.lte(min)) {
        onInvalidChange(true);
        return;
      }
      onInvalidChange(false);
    }, [amount, max, min, onInvalidChange]);

    useEffect(() => {
      onChangeProps && onChangeProps(amount);
    }, [amount, onChangeProps]);

    const suffix = useMemo(() => {
      return (
        <span onClick={getMax} className="text-brandDefault font-medium cursor-pointer text-base">
          Max
        </span>
      );
    }, [getMax]);

    const getAmount = useCallback(() => {
      return amount;
    }, [amount]);

    const ToolTipTitle = useMemo(() => {
      if (!tips) return null;
      return (
        <div className="flex flex-col">
          {tips.map((item, index) => {
            return <span key={index}>{item}</span>;
          })}
        </div>
      );
    }, [tips]);

    useImperativeHandle(ref, () => ({
      getAmount,
    }));

    return (
      <div className={`flex flex-col ${className}`}>
        <span className="text-neutralPrimary font-medium text-lg flex items-center">
          <span>{title}</span>

          {tips && (
            <ToolTip title={ToolTipTitle}>
              <QuestionIcon className="ml-[8px]" />
            </ToolTip>
          )}
        </span>
        <span className="mt-[4px] text-neutralSecondary text-base">{description}</span>
        <Input
          className="mt-[16px]"
          value={amount}
          onChange={onChange}
          suffix={suffix}
          status={status}
          placeholder={placeholder || 'Enter amount'}
        />
        {errorMessage && <span className="mt-[4px] text-sm text-functionalError">{errorMessage}</span>}
      </div>
    );
  },
);

// export default React.memo(SGRAmountInput);
export default SGRAmountInput;
