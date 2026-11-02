from typing import Protocol
import math


class SumberSuhu(Protocol):
    def baca(self) -> float: ...


class SensorLatihan:
    def baca(self) -> float:
        return 28.5


class SensorCadangan:
    def baca(self) -> float:
        return 31.0


def laporan(sumber: SumberSuhu) -> str:
    suhu = sumber.baca()
    if isinstance(suhu, bool) or not isinstance(suhu, (int, float)) or not math.isfinite(suhu):
        raise ValueError('Suhu harus angka terbatas.')
    return f'Suhu: {suhu:.1f} C'


if __name__ == '__main__':
    print(laporan(SensorLatihan()))
    print(laporan(SensorCadangan()))
