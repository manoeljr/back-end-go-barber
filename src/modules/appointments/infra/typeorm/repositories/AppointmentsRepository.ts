import { getRepository, Repository, Raw } from 'typeorm';
import Appointment from '../entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllMonthFromProviderDTO';
import IFindAllDayFromProviderDTO from '@modules/appointments/dtos/IFindAllDayFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository{

  private ormRepository: Repository<Appointment>;

  constructor(){
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllMonthFromProviderDTO): Promise<Appointment[]> {

    const parseMonth = String(month).padStart(2, '0');

    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName => `to_char(${dateFieldName}, 'MM-YYYY') = ${parseMonth}-${year}`,
        ),
      }
    });
    return appointments;
  }

  public async findAllInDayFromProvider({ provider_id, day, month, year }: IFindAllDayFromProviderDTO): Promise<Appointment[]> {

    const parseDay = String(day).padStart(2, '0');
    const parseMonth = String(month).padStart(2, '0');

    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName => `to_char(${dateFieldName}, 'DD-MM-YYYY') = ${parseDay}-${parseMonth}-${year}`,
        ),
      },
      relations: ['user'],
    });
    return appointments;
  }

  public async create({ provider_id, user_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date});
    await this.ormRepository.save(appointment);
    return appointment;
  }

}


export default AppointmentsRepository;
