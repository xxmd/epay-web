import {useEffect, useState} from 'react';
import enumApi, {EnumName, type EnumOption} from '@/api/enum';

export function useEnum(name: EnumName): EnumOption[] {
    const [options, setOptions] = useState<EnumOption[]>([]);

    useEffect(() => {
        enumApi.get(name).then(setOptions);
    }, [name]);

    return options;
}
