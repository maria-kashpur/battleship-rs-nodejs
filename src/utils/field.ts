import getRandomIntInclusive from "./getRandomIntInclusive";

export interface Coordinates {
  x: number,
  y: number
}

export const enum TypeNeighboringCell {
  vertical = "vertical",
  horizontal = "horizontal",
  angle = "angle",
}

export const enum TypeNeighboringCells {
  headTail = "headTail",
  center = "center",
  angle = "angle",
}

export const enum TypeGroupCells {
  vertical = "vertical",
  horizontal = "horizontal",
}

export default class Field {
  field: unknown[][];
  fieldSize: { w: number; h: number };

  constructor(fieldSize: { w: number; h: number }, fill = null) {
    this.field = Array.from({ length: fieldSize.h }, () =>
      Array.from({ length: fieldSize.w }).fill(fill)
    );
    this.fieldSize = fieldSize;
  }

  getCellValue(target: Coordinates) {
    const { x, y } = target;
    return this.field[y][x];
  }

  getCellsValue(data: Coordinates[]): unknown[] {
    return data.map((el) => this.field[el.y][el.x]);
  }

  fillCell(target: Coordinates, value: unknown) {
    const { x, y } = target;
    this.field[y][x] = value;
  }

  fillCells(data: { target: Coordinates; fill: unknown }[]) {
    data.forEach((el) => {
      const { x, y } = el.target;
      const { fill } = el;
      this.field[y][x] = fill;
    });
  }

  getNeighborsForCell(
    target: Coordinates,
    type?: TypeNeighboringCell
  ): Coordinates[] {
    const currentX = target.x;
    const currentY = target.y;

    const angle = [
      { x: currentX - 1, y: currentY - 1 },
      { x: currentX - 1, y: currentY + 1 },
      { x: currentX + 1, y: currentY - 1 },
      { x: currentX + 1, y: currentY + 1 },
    ];

    const horizontal = [
      { x: currentX - 1, y: currentY, type },
      { x: currentX + 1, y: currentY, type },
    ];

    const vertical = [
      { x: currentX, y: currentY - 1, type },
      { x: currentX, y: currentY + 1, type },
    ];

    let coondinates: Coordinates[] = [];

    switch (type) {
      case TypeNeighboringCell.angle:
        coondinates.concat(angle);
        break;
      case TypeNeighboringCell.horizontal:
        coondinates.concat(horizontal);
        break;
      case TypeNeighboringCell.vertical:
        coondinates.concat(vertical);
        break;
      default:
        coondinates.concat(angle, horizontal, vertical);
        break;
    }

    const validCoordinates = this.getValidCoordinates(coondinates);

    return validCoordinates;
  }

  static getGroupCells(
    firstCell: Coordinates,
    length: number,
    type: TypeGroupCells
  ): Coordinates[] {
    const currentX = firstCell.x;
    const currentY = firstCell.y;

    const coondinates = Array.from({ length: length }).map((_, i) => {
      const x = type === TypeGroupCells.horizontal ? currentX + i : currentX;
      const y = type === TypeGroupCells.vertical ? currentY + i : currentY;
      return { x, y };
    });

    return coondinates
  }

  getNeighborsForCells(
    coondinates: Coordinates[],
    typeGroupCells: TypeGroupCells,
    typeNeighboringCells?: TypeNeighboringCells
  ) {
    let headTail: Coordinates[] = [];
    let center: Coordinates[] = [];
    let angle: Coordinates[] = [];

    if (typeGroupCells === TypeGroupCells.horizontal) {
      coondinates.map((sector, i, arr) => {
        if (i === 0) {
          angle.push({ x: sector.x - 1, y: sector.y - 1 });
          headTail.push({ x: sector.x - 1, y: sector.y });
          angle.push({ x: sector.x - 1, y: sector.y + 1 });
        }
        if (i === arr.length - 1) {
          angle.push({ x: sector.x + 1, y: sector.y - 1 });
          headTail.push({ x: sector.x + 1, y: sector.y });
          angle.push({ x: sector.x + 1, y: sector.y + 1 });
        }
        center.push({ x: sector.x, y: sector.y - 1 });
        center.push({ x: sector.x, y: sector.y + 1 });
      });
    }

    if (typeGroupCells === TypeGroupCells.vertical) {
      coondinates.map((sector, i, arr) => {
        if (i === 0) {
          angle.push({ x: sector.x - 1, y: sector.y - 1 });
          headTail.push({ x: sector.x, y: sector.y - 1 });
          angle.push({ x: sector.x + 1, y: sector.y - 1 });
        }
        if (i === arr.length - 1) {
          angle.push({ x: sector.x - 1, y: sector.y + 1 });
          headTail.push({ x: sector.x, y: sector.y + 1 });
          angle.push({ x: sector.x + 1, y: sector.y + 1 });
        }
        center.push({ x: sector.x - 1, y: sector.y });
        center.push({ x: sector.x + 1, y: sector.y });
      });
    }

    let result: Coordinates[] = [];

    switch (typeNeighboringCells) {
      case TypeNeighboringCells.headTail:
        result.concat(headTail);
        break;
      case TypeNeighboringCells.center:
        result.concat(center);
        break;
      case TypeNeighboringCells.angle:
        result.concat(angle);
        break;
      default:
        result.concat(headTail, center, angle);
        break;
    }

    return this.getValidCoordinates(result);
  }

  private getValidCoordinates(coordinates: Coordinates[]) {
    return coordinates.filter(
      (el) =>
        el.x >= 0 &&
        el.y >= 0 &&
        el.x < this.fieldSize.w &&
        el.y < this.fieldSize.h
    );
  }

  getRamdomCoordinates(): Coordinates {
    const x = getRandomIntInclusive(0, this.fieldSize.w - 1);
    const y = getRandomIntInclusive(0, this.fieldSize.h - 1);
    return { x, y };
  }

  getAllCoordinatesWithValue(value: unknown): Coordinates[] {
    const coondinates: Coordinates[] = [];
    this.field.forEach((row, y) => {
      row.forEach((el, x) => {
        if (el === value) {
          coondinates.push({ x, y });
        }
      });
    });
    return coondinates;
  }

  getAllCoordinatesWithoutValue(value: unknown): Coordinates[] {
    const coondinates: Coordinates[] = [];
    this.field.forEach((row, y) => {
      row.forEach((el, x) => {
        if (el !== value) {
          coondinates.push({ x, y });
        }
      });
    });
    return coondinates;
  }
}
