# Reglas de Negocio 
sistema de roles de Just :

1. ***Consultora:** :rol inicial que se encarga del a venta directa 

2. **Lider de grupo:**   personal con mayor experiencia que ya tiene un grupo de venta se encargade capacitar y de sus propias ventas 

3. **Lider:** Mayor jerarquia se encarga de gestionar varios grupos 

## Creacion de cuentas y permisos 

-  las cuentas se pueden crear de forma publica desde el formulario de registro
- no se permite definir le rol desde el registro para evitar roles superiores sera por defecto "consultora"
- La consultora con un rol superior a "consultora"  pueden tener un numero limitado  tecnico de 15 hijos 
- el consultora se crea inicialmente sin padre (id_distribuidor_padre=null)
- se asignaran consultora padre por un codigo de invitacion por ejemplo "JUAN-7XL"
- el codigo tendra una fecha de vencimiento de 3 dias ,cuando se quiera vincular a una jerarquia se valida si el codigo no ha expirado , ademas es reutilizable 
-la renovacion del codigo invalida el anterior ya que se comprueba con el actual en la base de datos , mientras este activo tiene usos ilimitados 
- el codigo de invitacion solo puede generarlo el distribuidor dueño del mismo desde el panel de perfil 
- solo es posible vincularse a una jerarquia sera editando el distribuidor de forma privada ,haciendo una peticion usando el codigo de inivitacion ,no desde el signup 
- el cambio en la gerarquia sera editando el distribuidor ya de forma privada , es necesario validar que el cambio que se realizara no es un rol menor que al de los hijos (consultora < lider de grupo < Lider )
- validar en cada vinculacion a una gerarquia si el usuario a vincular tiene menor rol que el padre en caso contrario denegar (consultora < lider de grupo < Lider )
- validar los roles para evitar ciclos por ejemplo 
(lider - lider de grupo - Lider ) y evitar la autoasignacion si ya tienes un padre con un rol superior 
- validar que no se ingrese el mismo codigo de invitacino del usuario para evitar autoasignacion y validar que un nodo no puede tener como padre a uno de sus descendientes
- si el padre esta inactivo no es posible asociar mas hijos al mismo hasta que cambie su estado 
- Cuando se crea un usuario nuevo es necesario relaizar una transaccion atomica creando distribuidor y inventario a su vez si algo falla se cancela todo 
