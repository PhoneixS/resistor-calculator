import { MaterialSharedModule } from './material-shared.module';

describe('MaterialSharedModule', () => {
  let materialSharedModule: MaterialSharedModule;

  beforeEach(() => {
    materialSharedModule = new MaterialSharedModule();
  });

  it('should create an instance', () => {
    expect(materialSharedModule).toBeTruthy();
  });
});
