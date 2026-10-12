import type {DefinedVideo} from '../shared/defineVideo';
import californiaVsTexas from './california-vs-texas';
import giaDinh4Nguoi from './gia-dinh-4-nguoi';
import luong4000Usd from './luong-4000-usd';
import songOMy1Thang from './song-o-my-1-thang';
import songOMyPhongSu from './song-o-my-phong-su';

/** Thêm video mới: tạo thư mục trong src/videos/ rồi import vào danh sách này. */
export const videos: DefinedVideo[] = [giaDinh4Nguoi, californiaVsTexas, luong4000Usd, songOMyPhongSu, songOMy1Thang];
