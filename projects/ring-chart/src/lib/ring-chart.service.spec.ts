import { TestBed } from '@angular/core/testing';
import { RingChartService } from './ring-chart.service';

describe('RingChartService', () => {
  let service: RingChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RingChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make sure the thickness is at most half the diameter', () => {
    const inputDiameter1 = 500;
    const inputThickness1 = 400;
    const outputThickness1 = service.getThickness(inputThickness1, inputDiameter1);
    expect(outputThickness1).toEqual(250);

    const inputDiameter2 = 500;
    const inputThickness2 = 50;
    const outputThickness2 = service.getThickness(inputThickness2, inputDiameter2);
    expect(outputThickness2).toEqual(50);
  });

  it('should make sure the 2 sections are created for the overlap section', () => {
    const sections = [
      {
        percentage: 0.4,
        color: 'red'
      },
      {
        percentage: 0.2,
        color: 'green'
      },
      {
        percentage: 0.4,
        color: 'blue'
      }
    ];

    const partition = service.getRingSectionsPartition(sections);
    expect(partition.rightSections[0].color).toEqual('red');
    expect(partition.rightSections[0].index).toEqual(0);
    expect(partition.rightSections[0].rotation).toEqual(180);

    expect(partition.rightSections[1].color).toEqual('green');
    expect(partition.rightSections[1].index).toEqual(1);
    expect(partition.rightSections[1].rotation).toEqual(324);

    expect(partition.leftSections[0].color).toEqual('green');
    expect(partition.leftSections[0].index).toEqual(1);
    expect(partition.leftSections[0].rotation).toEqual(180);

    expect(partition.leftSections[1].color).toEqual('blue');
    expect(partition.leftSections[1].index).toEqual(2);
    expect(partition.leftSections[1].rotation).toEqual(216);
  });

  it('should make sure no additional section when there is no overlapping', () => {
    const sections = [
      {
        percentage: 0.5,
        color: 'red'
      },
      {
        percentage: 0.5,
        color: 'green'
      }
    ];

    const partition = service.getRingSectionsPartition(sections);
    expect(partition.leftSections.length).toEqual(1);
    expect(partition.rightSections.length).toEqual(1);

    expect(partition.rightSections[0].color).toEqual('red');
    expect(partition.rightSections[0].index).toEqual(0);
    expect(partition.rightSections[0].rotation).toEqual(180);

    expect(partition.leftSections[0].color).toEqual('green');
    expect(partition.leftSections[0].index).toEqual(1);
    expect(partition.leftSections[0].rotation).toEqual(180);
  });

  it('should make sure one section is partitioned correctly', () => {
    const sections = [
      {
        percentage: 1,
        color: 'red'
      }
    ];

    const partition = service.getRingSectionsPartition(sections);
    expect(partition.leftSections.length).toEqual(1);
    expect(partition.rightSections.length).toEqual(1);

    expect(partition.rightSections[0].color).toEqual('red');
    expect(partition.rightSections[0].index).toEqual(0);
    expect(partition.rightSections[0].rotation).toEqual(180);

    expect(partition.leftSections[0].color).toEqual('red');
    expect(partition.leftSections[0].index).toEqual(0);
    expect(partition.leftSections[0].rotation).toEqual(180);
  });

  it('should make sure sections array validation works properly', () => {
    const sections = 5;

    expect(() => service.validateSections(sections as any))
      .toThrowError('sections must be of type array');
  });

  it('should make sure validations for section percantages works properly', () => {
    const sections1 = [
      {
        percentage: 1.2,
        color: 'red'
      }
    ];

    expect(() => service.validateSections(sections1 as any))
      .toThrowError('section percentage must be a number and not bigger than 1');

    const sections2 = [
      {
        percentage: 'blabla',
        color: 'red'
      }
    ];

    expect(() => service.validateSections(sections2 as any))
      .toThrowError('section percentage must be a number and not bigger than 1');
  });

  it('should make sure sections percentages are exactly one', () => {
    const sections1 = [
      {
        percentage: 0.8,
        color: 'red'
      },
      {
        percentage: 0.6,
        color: 'green'
      }
    ];

    expect(() => service.validateSections(sections1 as any))
      .toThrowError('sections percentage sum must be equal to 1');

    const sections2 = [
      {
        percentage: 0.3,
        color: 'red'
      },
      {
        percentage: 0.4,
        color: 'green'
      }
    ];

    expect(() => service.validateSections(sections2 as any))
      .toThrowError('sections percentage sum must be equal to 1');
  });
});
