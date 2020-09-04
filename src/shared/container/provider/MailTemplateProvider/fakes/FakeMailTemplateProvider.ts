import IMailTemplateProvider from '../models/IMailTemplateProvider';
import FakesHashProvider from '@modules/users/providers/HashProvider/fakes/FakesHashProvider';


class FakeMailTemplateProvider implements IMailTemplateProvider{
  public async parse(): Promise<string>{
    return 'Mail Content';
  };
}

export default FakesHashProvider;
